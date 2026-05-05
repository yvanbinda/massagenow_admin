import React from 'react';
import { adminService } from "@/services/admin.service";
import AuditLogsClient from "./AuditLogsClient";

// Force dynamic rendering to ensure real-time security logs
export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  // Fetch real audit logs from Firestore
  const logs = await adminService.getAuditLogs();

  return (
    <AuditLogsClient initialLogs={logs} />
  );
}
