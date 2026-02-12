"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface SubmissionActionsProps {
  submissionId: string;
  currentStatus: string;
}

export function SubmissionActions({ submissionId, currentStatus }: SubmissionActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
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

  const handleReject = async () => {
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

  if (currentStatus !== "PENDING") {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleApprove}
        disabled={isLoading}
        className="text-green-600 hover:text-green-700"
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleReject}
        disabled={isLoading}
        className="text-red-600 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
