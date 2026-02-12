"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmissionTable } from "@/components/submission-table";

interface Submission {
  id: string;
  videoUrl?: string | null;
  videoKey?: string | null;
  status: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name?: string | null;
    email: string;
  };
  campaign: {
    id: string;
    title: string;
    cpmRate: number;
  };
  viewTrackings?: {
    viewCount: number;
  }[];
}

export function SubmissionActions({ submissions }: { submissions: Submission[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async (submissionId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error approving submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error rejecting submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubmissionTable
      submissions={submissions}
      showActions={true}
      showViews={true}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
