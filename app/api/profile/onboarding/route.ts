import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { niche, platforms, followers, bio, companyName, website } = body;

    // Update or create profile
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        niche: niche || null,
        platforms: platforms || [],
        followers: followers || 0,
        bio: bio || null,
        companyName: companyName || null,
        website: website || null,
      },
      create: {
        userId: session.user.id,
        niche: niche || null,
        platforms: platforms || [],
        followers: followers || 0,
        bio: bio || null,
        companyName: companyName || null,
        website: website || null,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
