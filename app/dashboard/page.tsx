import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { WalletCard } from "@/components/wallet-card";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { TrendingUp, Eye, DollarSign, Users, Briefcase, FileVideo } from "lucide-react";

async function getDashboardStats(userId: string, role: UserRole) {
  if (role === "BRAND") {
    const campaigns = await prisma.campaign.findMany({
      where: { brandId: userId },
      include: {
        submissions: {
          include: {
            viewTrackings: true,
          },
        },
      },
    });

    const totalViews = campaigns.reduce((sum, campaign) => {
      return (
        sum +
        campaign.submissions.reduce((subSum, submission) => {
          return (
            subSum +
            submission.viewTrackings.reduce((viewSum, tracking) => viewSum + tracking.viewCount, 0)
          );
        }, 0)
      );
    }, 0);

    const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.currentSpend, 0);

    const activeCreators = new Set(
      campaigns.flatMap((campaign) =>
        campaign.submissions
          .filter((sub) => sub.status === "APPROVED")
          .map((sub) => sub.creatorId)
      )
    ).size;

    return {
      totalViews,
      totalSpend,
      activeCreators,
      activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    };
  } else if (role === "CREATOR") {
    const submissions = await prisma.submission.findMany({
      where: { creatorId: userId },
      include: {
        campaign: true,
        viewTrackings: true,
      },
    });

    const approvedSubmissions = submissions.filter((s) => s.status === "APPROVED");

    const totalViews = approvedSubmissions.reduce((sum, submission) => {
      return sum + submission.viewTrackings.reduce((viewSum, tracking) => viewSum + tracking.viewCount, 0);
    }, 0);

    const totalEarnings = approvedSubmissions.reduce((sum, submission) => {
      const views = submission.viewTrackings.reduce((viewSum, tracking) => viewSum + tracking.viewCount, 0);
      return sum + (views / 1000) * submission.campaign.cpmRate;
    }, 0);

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    return {
      totalViews,
      totalEarnings: totalEarnings,
      pendingEarnings: wallet?.pendingBalance || 0,
      activeCampaigns: new Set(approvedSubmissions.map((s) => s.campaignId)).size,
    };
  }

  return {
    totalViews: 0,
    totalSpend: 0,
    activeCreators: 0,
    activeCampaigns: 0,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const stats = await getDashboardStats(session.user.id, session.user.role);

  let wallet = null;
  if (session.user.role === "CREATOR") {
    wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {session.user.role === "BRAND" ? (
            <>
              <StatsCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                icon={Eye}
                description="Across all campaigns"
              />
              <StatsCard
                title="Total Spend"
                value={`$${stats.totalSpend.toFixed(2)}`}
                icon={DollarSign}
                description="Current campaign spend"
              />
              <StatsCard
                title="Active Creators"
                value={stats.activeCreators}
                icon={Users}
                description="Working on campaigns"
              />
              <StatsCard
                title="Active Campaigns"
                value={stats.activeCampaigns}
                icon={Briefcase}
                description="Currently running"
              />
            </>
          ) : (
            <>
              <StatsCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                icon={Eye}
                description="On approved submissions"
              />
              <StatsCard
                title="Total Earnings"
                value={`$${stats.totalEarnings?.toFixed(2) || "0.00"}`}
                icon={DollarSign}
                description="Lifetime earnings"
              />
              <StatsCard
                title="Pending Earnings"
                value={`$${stats.pendingEarnings?.toFixed(2) || "0.00"}`}
                icon={TrendingUp}
                description="Awaiting approval"
              />
              <StatsCard
                title="Active Campaigns"
                value={stats.activeCampaigns}
                icon={FileVideo}
                description="With approved content"
              />
            </>
          )}
        </div>

        {session.user.role === "CREATOR" && wallet && (
          <div className="grid gap-4 md:grid-cols-2">
            <WalletCard
              balance={wallet.balance}
              pendingBalance={wallet.pendingBalance}
              totalEarned={wallet.totalEarned}
              lastTransactionDate={wallet.transactions[0]?.createdAt}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
