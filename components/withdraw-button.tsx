"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WithdrawButtonProps {
  walletId: string;
  balance: number;
}

export function WithdrawButton({ walletId, balance }: WithdrawButtonProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWithdraw = async () => {
    setIsLoading(true);
    setError("");

    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      setIsLoading(false);
      return;
    }

    if (withdrawAmount > balance) {
      setError("Amount exceeds available balance");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId, amount: withdrawAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Withdrawal failed");
        return;
      }

      router.refresh();
      setAmount("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="amount">Withdrawal Amount</Label>
        <div className="flex gap-2">
          <Input
            id="amount"
            type="number"
            step="0.01"
            max={balance}
            placeholder={`Max: $${balance.toFixed(2)}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleWithdraw} disabled={isLoading || !amount}>
            {isLoading ? "Processing..." : "Withdraw"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Available balance: ${balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
