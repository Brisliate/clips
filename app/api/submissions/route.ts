import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    const where: any = {};

    if (session.user.role === "CREATOR") {
      where.creatorId = session.user.id;
    } else if (session.user.role === "BRAND") {
      if (campaignId) {
        where.campaignId = campaignId;
        // Verify brand owns the campaign
        const campaign = await prisma.campaign.findFirst({
          where: { id: campaignId, brandId: session.user.id },
        });
        if (!campaign) {
          return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }
      } else {
        // Get all submissions for brand's campaigns
        const brandCampaigns = await prisma.campaign.findMany({
          where: { brandId: session.user.id },
          select: { id: true },
        });
        where.campaignId = { in: brandCampaigns.map((c) => c.id) };
      }
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        campaign: true,
        creator: true,
        viewTrackings: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId, videoUrl, videoKey, notes } = body;

    if (!campaignId || (!videoUrl && !videoKey)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify campaign exists and is active
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        status: "ACTIVE",
        expirationDate: { gte: new Date() },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found or not active" }, { status: 404 });
    }

    // Check if creator already submitted
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        campaignId,
        creatorId: session.user.id,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ error: "You have already submitted to this campaign" }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: {
        campaignId,
        creatorId: session.user.id,
        videoUrl: videoUrl || null,
        videoKey: videoKey || null,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        campaign: true,
        creator: true,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
