import { prisma } from "@/lib/prisma";
import { 
  Gavel, 
  ShieldAlert, 
  MessageSquare, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { DisputeActions } from "./DisputeActions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    where: { status: "OPEN" },
    include: {
      booking: {
        include: {
          customer: { select: { name: true } },
          merchant: { select: { companyName: true } }
        }
      },
      evidence: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0d0d0d] p-6 rounded-3xl border border-[#1a1a1a] mb-8">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Gavel className="text-[#d4af37]" />
            Arbitration Tribunal
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold font-mono">Dispute Resolution Command Center</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Active Cases</p>
             <p className="text-xl font-black text-[#d4af37]">{disputes.length}</p>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {disputes.length === 0 ? (
          <div className="p-32 text-center rounded-[3rem] border border-[#1a1a1a] bg-[#0d0d0d] shadow-inner">
             <CheckCircle2 size={64} className="mx-auto text-[#d4af37] mb-6 opacity-20" />
             <p className="text-gray-500 text-lg font-bold">No active disputes requiring human intervention.</p>
             <p className="text-sm text-gray-600 mt-2 italic">Neural networks are handling low-risk cases automatically.</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))
        )}
      </div>
    </div>
  );
}

function DisputeCard({ dispute }: any) {
  return (
    <div className="bg-[#0d0d0d] border border-[#d4af37]/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Gavel size={120} />
      </div>

      <div className="flex flex-col xl:flex-row gap-12 relative z-10">
        {/* Left Side: Context & AI Reasoning */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black border border-red-500/20 rounded-full uppercase tracking-widest">Case #DIS-{dispute.id.slice(-6).toUpperCase()}</span>
             <span className="text-gray-600 text-xs font-bold">{format(new Date(dispute.createdAt), 'MMM dd, HH:mm')}</span>
          </div>

          <div>
             <h3 className="text-2xl font-black text-white leading-tight">
               {dispute.booking.customer.name} <span className="text-[#d4af37] mx-2">vs</span> {dispute.booking.merchant.companyName}
             </h3>
             <p className="text-gray-500 text-sm mt-2 italic">Reason for dispute: {dispute.reason}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#141414] border border-[#d4af37]/10 relative group/ai">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-[#d4af37] text-black">
                   <AlertTriangle size={14} />
                </div>
                <h4 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em]">AI Arbiter Premise</h4>
             </div>
             <p className="text-sm text-[#e5e5e5] leading-relaxed italic">
               "{dispute.aiReasoning || "Awaiting secondary neural analysis for this case context."}"
             </p>
             <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                   <div className="h-full bg-[#d4af37] w-3/4"></div>
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase">AI Confidence: 75%</span>
             </div>
          </div>
        </div>

        {/* Middle: Evidence Gallery */}
        <div className="w-full xl:w-80">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ImageIcon size={14} className="text-[#d4af37]" />
            Evidence Gallery
          </h4>
          <div className="grid grid-cols-2 gap-3">
             {dispute.evidence.length === 0 ? (
               <div className="col-span-2 p-10 border border-dashed border-[#1a1a1a] rounded-2xl text-center text-gray-700">
                  No visual proof provided.
               </div>
             ) : (
               dispute.evidence.map((ev: any, idx: number) => (
                 <div key={idx} className="aspect-square rounded-2xl bg-gray-900 overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all cursor-zoom-in relative group/img">
                    <img src={ev.fileUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <span className="text-[10px] font-bold text-white uppercase">{ev.type}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Right Side: Decisions */}
        <div className="w-full xl:w-64 border-t xl:border-t-0 xl:border-l border-[#1a1a1a] pt-8 xl:pt-0 xl:pl-8 flex flex-col justify-center">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 block text-center xl:text-left">Human Verdict Required</h4>
           <DisputeActions disputeId={dispute.id} />
        </div>
      </div>
    </div>
  );
}
