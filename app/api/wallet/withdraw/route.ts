import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { walletId, amount } = body;

    if (!walletId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Get wallet and verify ownership
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet || wallet.userId !== session.user.id) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.balance < withdrawAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create payout via Stripe (simplified - you'll need to implement proper Stripe Connect)
    // For MVP, we'll just create a transaction record
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        userId: session.user.id,
        type: "PAYOUT",
        amount: withdrawAmount,
        status: "PENDING",
        description: `Withdrawal of $${withdrawAmount.toFixed(2)}`,
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          decrement: withdrawAmount,
        },
      },
    });

    // TODO: Integrate with Stripe Connect for actual payouts
    // For now, mark as completed after a delay (in production, use webhooks)

    return NextResponse.json({ transaction, message: "Withdrawal initiated" });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
