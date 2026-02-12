import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getCampaigns(userId: string) {
  return await prisma.campaign.findMany({
    where: { brandId: userId },
    include: {
      submissions: {
        include: {
          viewTrackings: true,
        },
      },
      viewTrackings: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BrandCampaignsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  const campaigns = await getCampaigns(session.user.id);

  const campaignsWithStats = campaigns.map((campaign) => {
    const totalViews = campaign.submissions.reduce((sum, submission) => {
      return sum + submission.viewTrackings.reduce((viewSum, tracking) => viewSum + tracking.viewCount, 0);
    }, 0);

    return {
      ...campaign,
      totalViews,
      submissionsCount: campaign.submissions.length,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">Manage your UGC campaigns</p>
          </div>
          <Button asChild>
            <Link href="/brand/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {campaignsWithStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Button asChild>
              <Link href="/brand/campaigns/new">Create your first campaign</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaignsWithStats.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                id={campaign.id}
                title={campaign.title}
                description={campaign.description}
                platform={campaign.platform}
                cpmRate={campaign.cpmRate}
                maxBudget={campaign.maxBudget}
                currentSpend={campaign.currentSpend}
                expirationDate={campaign.expirationDate}
                status={campaign.status}
                minFollowers={campaign.minFollowers}
                requiredNiche={campaign.requiredNiche}
                submissionsCount={campaign.submissionsCount}
                totalViews={campaign.totalViews}
                href={`/brand/campaigns/${campaign.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
