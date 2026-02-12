import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, viewCount } = body;

    if (!submissionId || viewCount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get submission and campaign
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { campaign: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "APPROVED") {
      return NextResponse.json({ error: "Submission must be approved" }, { status: 400 });
    }

    // Create view tracking entry
    const viewTracking = await prisma.viewTracking.create({
      data: {
        submissionId,
        campaignId: submission.campaignId,
        viewCount: parseInt(viewCount),
        source: "manual",
      },
    });

    // Calculate earnings
    const earnings = (parseInt(viewCount) / 1000) * submission.campaign.cpmRate;

    // Update campaign spend
    const updatedCampaign = await prisma.campaign.update({
      where: { id: submission.campaignId },
      data: {
        currentSpend: {
          increment: earnings,
        },
      },
    });

    // Check if budget exceeded
    if (updatedCampaign.currentSpend >= updatedCampaign.maxBudget) {
      await prisma.campaign.update({
        where: { id: submission.campaignId },
        data: { status: "COMPLETED" },
      });
    }

    // Update creator wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: submission.creatorId },
    });

    if (wallet) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: earnings,
          },
          totalEarned: {
            increment: earnings,
          },
        },
      });

      // Create transaction
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          userId: submission.creatorId,
          type: "EARNINGS",
          amount: earnings,
          status: "COMPLETED",
          campaignId: submission.campaignId,
          submissionId: submission.id,
          description: `Earnings from ${viewCount} views`,
        },
      });
    }

    return NextResponse.json({ viewTracking, earnings });
  } catch (error) {
    console.error("Error tracking views:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
