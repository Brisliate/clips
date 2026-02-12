"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
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

export default function CreatorSubmissionsPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user) {
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading submissions...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || session.user.role !== "CREATOR") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <p className="text-muted-foreground">Track your submitted content and earnings</p>
        </div>

        <SubmissionTable submissions={submissions} showViews={true} />
      </div>
    </DashboardLayout>
  );
}
