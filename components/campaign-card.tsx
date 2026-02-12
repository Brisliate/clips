import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Platform, CampaignStatus } from "@prisma/client";
import { format } from "date-fns";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  cpmRate: number;
  maxBudget: number;
  currentSpend: number;
  expirationDate: Date;
  status: CampaignStatus;
  minFollowers?: number;
  requiredNiche?: string;
  submissionsCount?: number;
  totalViews?: number;
  href?: string;
}

const platformLabels: Record<Platform, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM_REELS: "Instagram Reels",
  YOUTUBE_SHORTS: "YouTube Shorts",
  ALL: "All Platforms",
};

const statusColors: Record<CampaignStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function CampaignCard({
  id,
  title,
  description,
  platform,
  cpmRate,
  maxBudget,
  currentSpend,
  expirationDate,
  status,
  minFollowers,
  requiredNiche,
  submissionsCount,
  totalViews,
  href,
}: CampaignCardProps) {
  const budgetUsed = (currentSpend / maxBudget) * 100;
  const isExpired = new Date(expirationDate) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{platformLabels[platform]}</Badge>
          {requiredNiche && <Badge variant="outline">{requiredNiche}</Badge>}
          {minFollowers && minFollowers > 0 && (
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {minFollowers.toLocaleString()}+ followers
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              CPM Rate
            </div>
            <div className="text-lg font-semibold">${cpmRate.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-1" />
              Budget
            </div>
            <div className="text-lg font-semibold">
              ${currentSpend.toFixed(2)} / ${maxBudget.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget Used</span>
            <span className="font-medium">{budgetUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
        </div>

        {totalViews !== undefined && (
          <div className="text-sm text-muted-foreground">
            Total Views: <span className="font-medium text-foreground">{totalViews.toLocaleString()}</span>
          </div>
        )}

        {submissionsCount !== undefined && (
          <div className="text-sm text-muted-foreground">
            Submissions: <span className="font-medium text-foreground">{submissionsCount}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          Expires: {format(new Date(expirationDate), "MMM d, yyyy")}
        </div>
      </CardContent>
      {href && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={href}>View Details</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
