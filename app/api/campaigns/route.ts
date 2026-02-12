import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const platform = searchParams.get("platform") as Platform | null;
    const minCpm = searchParams.get("minCpm");
    const maxCpm = searchParams.get("maxCpm");
    const niche = searchParams.get("niche");
    const minFollowers = searchParams.get("minFollowers");
    const status = searchParams.get("status");

    // If ID is provided, return single campaign
    if (id) {
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          submissions: {
            where: session.user.role === "CREATOR" ? { creatorId: session.user.id } : undefined,
          },
        },
      });
      return NextResponse.json([campaign].filter(Boolean));
    }

    const where: any = {};

    if (session.user.role === "BRAND") {
      where.brandId = session.user.id;
    } else if (session.user.role === "CREATOR") {
      where.status = "ACTIVE";
      const now = new Date();
      where.expirationDate = { gte: now };
    }

    if (platform && platform !== "ALL") {
      where.platform = platform;
    }

    if (minCpm) {
      where.cpmRate = { ...where.cpmRate, gte: parseFloat(minCpm) };
    }

    if (maxCpm) {
      where.cpmRate = { ...where.cpmRate, lte: parseFloat(maxCpm) };
    }

    if (niche) {
      where.requiredNiche = niche;
    }

    if (minFollowers) {
      where.minFollowers = { lte: parseInt(minFollowers) };
    }

    if (status) {
      where.status = status;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        submissions: {
          where: session.user.role === "CREATOR" ? { creatorId: session.user.id } : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      platform,
      cpmRate,
      maxBudget,
      contentGuidelines,
      expirationDate,
      minFollowers,
      requiredNiche,
    } = body;

    if (!title || !description || !platform || !cpmRate || !maxBudget || !expirationDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: session.user.id,
        title,
        description,
        platform,
        cpmRate: parseFloat(cpmRate),
        maxBudget: parseFloat(maxBudget),
        contentGuidelines: contentGuidelines || null,
        expirationDate: new Date(expirationDate),
        minFollowers: minFollowers ? parseInt(minFollowers) : null,
        requiredNiche: requiredNiche || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
