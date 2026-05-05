import { NextResponse } from 'next/server';
import { adminService } from '@/services/admin.service';
import { checkSuperAdminSession } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkSuperAdminSession();
    if (!isAuthorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ therapists: [], transactions: [], users: [] });
    }

    // Fetch all data to filter locally (Simple approach for admin panel)
    const [therapists, users, transactions] = await Promise.all([
      adminService.getTherapistsForDirectory(),
      adminService.getPatientsForDirectory(),
      adminService.getAllTransactions()
    ]);

    const filteredTherapists = therapists.filter(t => 
      t.name?.toLowerCase().includes(query) || 
      t.professionalName?.toLowerCase().includes(query) ||
      t.email?.toLowerCase().includes(query)
    ).slice(0, 5);

    const filteredUsers = users.filter(u => 
      u.name?.toLowerCase().includes(query) || 
      u.email?.toLowerCase().includes(query)
    ).slice(0, 5);

    const filteredTransactions = transactions.filter(txn => 
      txn.id.toLowerCase().includes(query) ||
      txn.clientName?.toLowerCase().includes(query) ||
      txn.therapistName?.toLowerCase().includes(query)
    ).slice(0, 5);

    return NextResponse.json({
      therapists: filteredTherapists,
      users: filteredUsers,
      transactions: filteredTransactions
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
