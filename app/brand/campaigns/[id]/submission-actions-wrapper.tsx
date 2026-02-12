"use client";

import { SubmissionActions } from "./submission-actions";

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

export function SubmissionActionsWrapper({ submissions }: { submissions: Submission[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submissions</h2>
      <SubmissionActions submissions={submissions} />
    </div>
  );
}
