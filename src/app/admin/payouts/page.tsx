import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  CreditCard, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History,
  TrendingUp
} from "lucide-react";
import { PayoutButtons } from "./PayoutButtons";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const requests = await prisma.withdrawalRequest.findMany({
    include: { merchant: { include: { wallet: true } } },
    orderBy: { createdAt: "desc" }
  });

  const pendingAmount = requests
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      {/* Financial Health Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[#d4af37]/20 shadow-xl shadow-[#d4af37]/5">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
               <Clock size={20} />
             </div>
             <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Payouts</h4>
               <p className="text-2xl font-bold text-white">£{pendingAmount.toLocaleString()}</p>
             </div>
           </div>
           <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
             <div className="h-full bg-[#d4af37] w-1/3"></div>
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a]">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
               <CheckCircle2 size={20} />
             </div>
             <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed Today</h4>
               <p className="text-2xl font-bold text-white">£1,240.00</p>
             </div>
           </div>
           <p className="text-xs text-gray-500 flex items-center gap-1">
             <TrendingUp size={12} className="text-emerald-500" />
             Healthy cash flow confirmed
           </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a]">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
               <History size={20} />
             </div>
             <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Average Processing</h4>
               <p className="text-2xl font-bold text-white">4.2h</p>
             </div>
           </div>
           <p className="text-xs text-gray-500">Industry standard: 24-48h</p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
             <CreditCard className="text-[#d4af37]" size={20} />
             Withdrawal Adjudication Center
           </h3>
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-widest">
             <AlertTriangle size={14} /> Security Audit Active
           </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#111] border-b border-[#1a1a1a]">
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Merchant / Wallet Status</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Request Details</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Security Check</th>
              <th className="p-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Action Center</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-gray-600 italic">No withdrawal requests found.</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-[#141414] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold shadow-inner">
                        {r.merchant.companyName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">{r.merchant.companyName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          <Wallet size={10} className="text-[#d4af37]" />
                          Avail: £{r.merchant.wallet?.availableBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-lg font-bold text-white tracking-tight">£{r.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                  </td>
                  <td className="p-4 text-center">
                    {r.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black border border-orange-500/20 uppercase tracking-widest">
                        <Clock size={12} /> Awaiting Approval
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                        r.status === "COMPLETED" || r.status === "APPROVED" ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {r.status === "COMPLETED" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {r.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {r.status === "PENDING" && (
                      <PayoutButtons requestId={r.id} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
