import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { prisma } from "@/lib/prisma";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

async function getAdminStats() {
  const [totalUsers, totalCampaigns, totalTransactions, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.campaign.count(),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      where: { type: "DEPOSIT", status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalUsers,
    totalCampaigns,
    totalTransactions,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="All platform users"
          />
          <StatsCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={Briefcase}
            description="All campaigns created"
          />
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={DollarSign}
            description="All transactions"
          />
          <StatsCard
            title="Platform Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={TrendingUp}
            description="Total deposits"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
