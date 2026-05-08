import React from 'react';
import { adminService } from "@/services/admin.service";
import PaymentsClient from "./PaymentsClient";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  // 1. Fetch live metrics and transactions from Firestore
  const [stats, transactionsData] = await Promise.all([
    adminService.getPlatformOverview(),
    adminService.getAllTransactions()
  ]);

  // 2. Map the rich booking data to the transaction structure for the UI
  const transactions = transactionsData.map(txn => ({
    id: txn.id,
    patient: txn.clientName,
    clientName: txn.clientName,
    therapist: txn.therapistName,
    therapistName: txn.therapistName,
    amount: txn.priceSnapshot || 0,
    fee: txn.platformFee || 0,
    status: txn.status,
    paymentStatus: txn.paymentStatus, // Crucial for filtering
    date: txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('fr-FR') : 'N/A'
  }));

  const paymentStats = {
    grossVolume: stats.totalRevenue || 0,
    platformRevenue: stats.platformComm || 0,
    pendingPayouts: 0, // Placeholder
    activeDisputes: transactions.filter(t => t.paymentStatus === 'penalty_applied' || t.status === 'no_show').length,
  };

  return (
    <PaymentsClient 
      transactions={transactions} 
      stats={paymentStats} 
    />
  );
}
