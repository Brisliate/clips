import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CampaignCard } from "@/components/campaign-card";
import { SubmissionTable } from "@/components/submission-table";
import { StatsCard } from "@/components/stats-card";
import { prisma } from "@/lib/prisma";
import { Eye, DollarSign, Users, FileVideo } from "lucide-react";
import { notFound } from "next/navigation";
import { SubmissionActionsWrapper } from "./submission-actions-wrapper";

async function getCampaign(id: string, userId: string) {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      brandId: userId,
    },
    include: {
      submissions: {
        include: {
          creator: true,
          viewTrackings: true,
        },
        orderBy: { createdAt: "desc" },
      },
      viewTrackings: true,
    },
  });

  return campaign;
}

export default async function CampaignDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  const campaign = await getCampaign(params.id, session.user.id);

  if (!campaign) {
    notFound();
  }

  const totalViews = campaign.submissions.reduce((sum, submission) => {
    return sum + submission.viewTrackings.reduce((viewSum, tracking) => viewSum + tracking.viewCount, 0);
  }, 0);

  const activeCreators = new Set(
    campaign.submissions.filter((s) => s.status === "APPROVED").map((s) => s.creatorId)
  ).size;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            icon={Eye}
          />
          <StatsCard
            title="Total Spend"
            value={`$${campaign.currentSpend.toFixed(2)}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Active Creators"
            value={activeCreators}
            icon={Users}
          />
          <StatsCard
            title="Submissions"
            value={campaign.submissions.length}
            icon={FileVideo}
          />
        </div>

        <CampaignCard
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
          submissionsCount={campaign.submissions.length}
          totalViews={totalViews}
        />

        <SubmissionActionsWrapper submissions={campaign.submissions} />
      </div>
    </DashboardLayout>
  );
}
