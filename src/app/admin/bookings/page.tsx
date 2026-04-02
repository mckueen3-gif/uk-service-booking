import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  CalendarDays, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  Wallet,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import { BookingAdminActions } from "./booking-actions";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      merchant: { select: { companyName: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#0d0d0d] p-6 rounded-3xl border border-[#1a1a1a] gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <CalendarDays className="text-[#d4af37]" />
            Booking Command Hub
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">全平台交易控盤中心</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Customer, Expert..." 
              className="pl-10 pr-4 py-2.5 bg-[#141414] border border-[#1a1a1a] rounded-xl text-xs focus:border-[#d4af37] outline-none transition-all w-full lg:w-64"
            />
          </div>
          <button className="px-4 py-2.5 bg-[#141414] border border-[#1a1a1a] rounded-xl text-gray-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111] border-b border-[#1a1a1a]">
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Transaction ID / Sector</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Parties</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Financials</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Lifecycle</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Admin Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-[#141414] transition-colors group">
                <td className="p-4">
                  <span className="text-[10px] font-mono text-gray-500 block mb-1">#{booking.id.slice(-8).toUpperCase()}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                      booking.isEducation ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                    }`}>
                      {booking.isEducation ? 'Education' : 'Field Service'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-white leading-none flex items-center gap-1.5">
                      {booking.customer.name}
                      <ArrowRightLeft size={10} className="text-gray-600" />
                      {booking.merchant.companyName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">{booking.customer.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/5 text-[#d4af37]">
                      <Wallet size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white leading-none">£{booking.totalAmount.toFixed(2)}</p>
                      <p className="text-[9px] text-[#d4af37] font-black uppercase tracking-widest mt-1">Fee: £{booking.platformFee.toFixed(2)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={booking.status} />
                  <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase tracking-tighter">Sch: {format(new Date(booking.scheduledDate), 'MMM dd, HH:mm')}</p>
                </td>
                <td className="p-4 text-right">
                  <BookingAdminActions bookingId={booking.id} status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${styles[status]}`}>
      {status === 'COMPLETED' ? <CheckCircle2 size={12} /> : status === 'CANCELLED' ? <XCircle size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}
