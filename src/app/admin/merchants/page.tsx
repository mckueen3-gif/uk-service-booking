import { prisma } from "@/lib/prisma";
import { 
  Users, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0d0d0d] p-6 rounded-2xl border border-[#1a1a1a] mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#d4af37]" />
            Expert Management Directory
          </h2>
          <p className="text-sm text-gray-500 mt-1">Full list of registered service providers across the UK.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Filter experts..." 
            className="pl-10 pr-4 py-2 bg-[#141414] border border-[#1a1a1a] rounded-xl text-sm focus:border-[#d4af37] outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#141414] border-b border-[#1a1a1a]">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Expert / Company</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Rating</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {merchants.map((m) => (
              <tr key={m.id} className="hover:bg-[#121212] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[#d4af37] font-bold">
                      {m.companyName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">{m.companyName}</p>
                      <p className="text-xs text-gray-500">{m.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-1.5 text-xs text-gray-400">
                     <MapPin size={12} className="text-[#d4af37]" />
                     {m.city}
                   </div>
                </td>
                <td className="p-4 text-center">
                  {m.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-wider">
                      <ShieldAlert size={12} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1 text-[#d4af37]">
                    <Star size={14} fill="#d4af37" />
                    <span className="text-sm font-bold text-gray-200">{m.averageRating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <Link 
                       href={`/merchants/${m.id}`} 
                       target="_blank"
                       className="p-2 text-gray-500 hover:text-white transition-colors"
                     >
                       <ExternalLink size={18} />
                     </Link>
                     <button className="p-2 bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 rounded-lg text-[#d4af37] transition-all">
                       <ChevronRight size={18} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
