import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "BRAND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get submission and verify brand owns the campaign
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: { campaign: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.campaign.brandId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: params.id },
      data: { status: status as SubmissionStatus },
      include: {
        campaign: true,
        creator: true,
      },
    });

    // If approved, move pending balance to available balance
    if (status === "APPROVED") {
      // This will be handled by view tracking updates
      // For now, we just update the submission status
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
