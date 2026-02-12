import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WalletCard } from "@/components/wallet-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { WithdrawButton } from "@/components/withdraw-button";

async function getWallet(userId: string) {
  return await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export default async function WalletPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const wallet = await getWallet(session.user.id);

  if (!wallet && session.user.role === "CREATOR") {
    // Create wallet if it doesn't exist
    const newWallet = await prisma.wallet.create({
      data: { userId: session.user.id },
    });
    return (
      <DashboardLayout>
        <WalletCard
          balance={newWallet.balance}
          pendingBalance={newWallet.pendingBalance}
          totalEarned={newWallet.totalEarned}
        />
      </DashboardLayout>
    );
  }

  if (!wallet) {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <WalletCard
            balance={wallet.balance}
            pendingBalance={wallet.pendingBalance}
            totalEarned={wallet.totalEarned}
            lastTransactionDate={wallet.transactions[0]?.createdAt}
            onWithdraw={() => {}}
            showWithdrawButton={session.user.role === "CREATOR"}
          />

          {session.user.role === "CREATOR" && wallet.balance > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Transfer your earnings to your bank account</CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawButton walletId={wallet.id} balance={wallet.balance} />
              </CardContent>
            </Card>
          )}
        </div>

        {wallet.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wallet.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{transaction.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.description || "No description"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          transaction.type === "EARNINGS" || transaction.type === "DEPOSIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "EARNINGS" || transaction.type === "DEPOSIT" ? "+" : "-"}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
