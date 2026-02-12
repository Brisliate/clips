"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CampaignCard } from "@/components/campaign-card";
import { FilterBar } from "@/components/filter-bar";
import { CampaignFilters } from "@/lib/types";
import { Campaign } from "@prisma/client";

export default function CreatorCampaignsPage() {
  const { data: session, status } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user) {
      fetchCampaigns();
    }
  }, [session, filters]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.platform) params.append("platform", filters.platform);
      if (filters.minCpm) params.append("minCpm", filters.minCpm.toString());
      if (filters.maxCpm) params.append("maxCpm", filters.maxCpm.toString());
      if (filters.niche) params.append("niche", filters.niche);
      if (filters.minFollowers) params.append("minFollowers", filters.minFollowers.toString());

      const response = await fetch(`/api/campaigns?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading campaigns...</div>
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
          <h1 className="text-3xl font-bold">Browse Campaigns</h1>
          <p className="text-muted-foreground">Find UGC campaigns that match your niche</p>
        </div>

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No campaigns found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
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
                href={`/creator/campaigns/${campaign.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
