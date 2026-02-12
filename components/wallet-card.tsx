import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface WalletCardProps {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  lastTransactionDate?: Date;
  onWithdraw?: () => void;
  showWithdrawButton?: boolean;
}

export function WalletCard({
  balance,
  pendingBalance,
  totalEarned,
  lastTransactionDate,
  onWithdraw,
  showWithdrawButton = true,
}: WalletCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet
        </CardTitle>
        <CardDescription>Your earnings and balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Available Balance</span>
            </div>
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
          </div>

          {pendingBalance > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Pending</span>
              </div>
              <div className="text-lg font-semibold">${pendingBalance.toFixed(2)}</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Earned</span>
            </div>
            <div className="text-lg font-semibold">${totalEarned.toFixed(2)}</div>
          </div>
        </div>

        {lastTransactionDate && (
          <div className="text-xs text-muted-foreground">
            Last transaction: {format(new Date(lastTransactionDate), "MMM d, yyyy")}
          </div>
        )}

        {showWithdrawButton && balance > 0 && (
          <Button onClick={onWithdraw} className="w-full" disabled={balance === 0}>
            Withdraw Funds
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
