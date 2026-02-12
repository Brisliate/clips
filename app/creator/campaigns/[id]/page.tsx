"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CampaignCard } from "@/components/campaign-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing";
import { Campaign } from "@prisma/client";

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCampaign();
    }
  }, [session, params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data[0] || data);
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!videoUrl && !videoKey) {
      setError("Please provide a video URL or upload a file");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: params.id,
          videoUrl: videoUrl || null,
          videoKey: videoKey || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit");
        return;
      }

      router.push("/creator/submissions");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || session.user.role !== "CREATOR" || !campaign) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        <CampaignCard
          id={campaign.id}
          title={campaign.title}
          description={campaign.description}
          platform={campaign.platform}
          cpmRate={campaign.cpmRate}
          maxBudget={campaign.maxBudget}
          currentSpend={campaign.currentSpend}
          expirationDate={campaign.expirationDate}
          status={campaign.status}
          minFollowers={campaign.minFollowers}
          requiredNiche={campaign.requiredNiche}
        />

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Content</CardTitle>
            <CardDescription>Upload your UGC video or provide a link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <div className="space-y-2">
                <Label>Video URL (Optional)</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={!!videoKey}
                />
                <p className="text-xs text-muted-foreground">
                  Or upload a file below
                </p>
              </div>

              <div className="space-y-2">
                <Label>Upload Video</Label>
                <UploadButton
                  endpoint="videoUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setVideoKey(res[0].key);
                      setVideoUrl("");
                    }
                  }}
                  onUploadError={(error) => {
                    setError(`Upload failed: ${error.message}`);
                  }}
                />
                {videoKey && (
                  <p className="text-xs text-green-600">File uploaded successfully</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional information about your submission..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting || (!videoUrl && !videoKey)}>
                  {isSubmitting ? "Submitting..." : "Submit Content"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
