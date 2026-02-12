"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Platform, CampaignStatus } from "@prisma/client";
import { CampaignFilters } from "@/lib/types";
import { X } from "lucide-react";

interface FilterBarProps {
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  showStatusFilter?: boolean;
}

const platformOptions = [
  { value: "ALL", label: "All Platforms" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "INSTAGRAM_REELS", label: "Instagram Reels" },
  { value: "YOUTUBE_SHORTS", label: "YouTube Shorts" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
  { value: "EXPIRED", label: "Expired" },
];

export function FilterBar({ filters, onFiltersChange, showStatusFilter = false }: FilterBarProps) {
  const [localFilters, setLocalFilters] = useState<CampaignFilters>(filters);

  const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: CampaignFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select
              value={localFilters.platform || ""}
              onValueChange={(value) => handleFilterChange("platform", value as Platform)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Min CPM ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={localFilters.minCpm || ""}
              onChange={(e) => handleFilterChange("minCpm", e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label>Max CPM ($)</Label>
            <Input
              type="number"
              placeholder="100.00"
              value={localFilters.maxCpm || ""}
              onChange={(e) => handleFilterChange("maxCpm", e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label>Min Followers</Label>
            <Input
              type="number"
              placeholder="0"
              value={localFilters.minFollowers || ""}
              onChange={(e) => handleFilterChange("minFollowers", e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          {showStatusFilter && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={localFilters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value as CampaignStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Niche</Label>
            <Input
              placeholder="e.g., Fashion, Tech"
              value={localFilters.niche || ""}
              onChange={(e) => handleFilterChange("niche", e.target.value || undefined)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
