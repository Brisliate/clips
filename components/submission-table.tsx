"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmissionStatus } from "@prisma/client";
import { format } from "date-fns";
import { ExternalLink, Check, X, Eye } from "lucide-react";
import Link from "next/link";

interface Submission {
  id: string;
  videoUrl?: string | null;
  videoKey?: string | null;
  status: SubmissionStatus;
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

interface SubmissionTableProps {
  submissions: Submission[];
  onApprove?: (submissionId: string) => void;
  onReject?: (submissionId: string) => void;
  showActions?: boolean;
  showViews?: boolean;
}

const statusColors: Record<SubmissionStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function SubmissionTable({
  submissions,
  onApprove,
  onReject,
  showActions = false,
  showViews = true,
}: SubmissionTableProps) {
  const getTotalViews = (submission: Submission) => {
    if (!submission.viewTrackings || submission.viewTrackings.length === 0) return 0;
    return submission.viewTrackings.reduce((sum, tracking) => sum + tracking.viewCount, 0);
  };

  const calculateEarnings = (submission: Submission) => {
    const views = getTotalViews(submission);
    return (views / 1000) * submission.campaign.cpmRate;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Status</TableHead>
            {showViews && <TableHead>Views</TableHead>}
            {showViews && <TableHead>Earnings</TableHead>}
            <TableHead>Submitted</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 8 : 7} className="text-center text-muted-foreground py-8">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => {
              const totalViews = getTotalViews(submission);
              const earnings = calculateEarnings(submission);

              return (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.creator.name || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{submission.creator.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/brand/campaigns/${submission.campaign.id}`}
                      className="text-primary hover:underline"
                    >
                      {submission.campaign.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {submission.videoUrl ? (
                      <a
                        href={submission.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        View Video
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : submission.videoKey ? (
                      <span className="text-muted-foreground">Uploaded</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[submission.status]}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  {showViews && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        {totalViews.toLocaleString()}
                      </div>
                    </TableCell>
                  )}
                  {showViews && (
                    <TableCell>
                      <span className="font-medium">${earnings.toFixed(2)}</span>
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(submission.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      {submission.status === "PENDING" && onApprove && onReject ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApprove(submission.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(submission.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
