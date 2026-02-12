import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateCampaignForm } from "@/components/create-campaign-form";

export default async function CreateCampaignPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "BRAND") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Set up a new UGC campaign for creators</p>
        </div>
        <CreateCampaignForm />
      </div>
    </DashboardLayout>
  );
}
