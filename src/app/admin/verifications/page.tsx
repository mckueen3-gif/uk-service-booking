import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Eye,
  Search
} from "lucide-react";
import Link from "next/link";
import { VerificationButtons } from "./VerificationButtons";

export const dynamic = "force-dynamic";

export default async function VerificationsPage() {
  const pendingDocs = await prisma.merchantDocument.findMany({
    where: { status: { in: ["PENDING", "UNDER_ADMIN_REVIEW"] } },
    include: { merchant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0d0d0d] p-6 rounded-2xl border border-[#1a1a1a] mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-[#d4af37]" />
            Expert Verification Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review licenses, insurance, and background checks manually.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search merchants..." 
            className="pl-10 pr-4 py-2 bg-[#141414] border border-[#1a1a1a] rounded-xl text-sm focus:border-[#d4af37] outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingDocs.length === 0 ? (
          <div className="p-20 text-center rounded-3xl border border-[#1a1a1a] bg-[#0d0d0d]">
             <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-20" />
             <p className="text-gray-500 text-lg">No pending verifications found.</p>
          </div>
        ) : (
          pendingDocs.map((doc) => (
            <VerificationRow key={doc.id} doc={doc} />
          ))
        )}
      </div>
    </div>
  );
}

function VerificationRow({ doc }: any) {
  const isHighConfidence = doc.confidence && doc.confidence > 0.8;
  
  return (
    <div className="group bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#1a1a1a] flex items-center justify-center text-[#d4af37]">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
                {doc.type.replace('_', ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                doc.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              }`}>
                {doc.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg">{doc.merchant.companyName}</h3>
            <p className="text-xs text-gray-500 mt-1">Submitted: {format(new Date(doc.createdAt), 'yyyy-MM-dd HH:mm')}</p>
          </div>
        </div>

        {/* AI Insight Bridge */}
        <div className="flex-1 max-w-md p-4 rounded-xl bg-[#141414] border border-white/5 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">AI Extraction Result</span>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isHighConfidence ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {Math.round((doc.confidence || 0) * 100)}% Confidence
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-[10px] text-gray-500 font-bold uppercase">Reg #</p>
               <p className="text-sm font-mono text-[#e5e5e5]">{doc.registrationNumber || 'NOT FOUND'}</p>
             </div>
             <div>
               <p className="text-[10px] text-gray-500 font-bold uppercase">Expiry</p>
               <p className={`text-sm font-bold ${doc.expiryDate && new Date(doc.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-100'}`}>
                 {doc.expiryDate ? format(new Date(doc.expiryDate), 'yyyy-MM-dd') : 'UNKNOWN'}
               </p>
             </div>
          </div>
        </div>

        {/* Action Center Container */}
        <div className="flex items-center gap-2">
          <Link 
            href={doc.fileUrl} 
            target="_blank"
            className="p-3 bg-[#111] hover:bg-[#1a1a1a] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm font-bold"
          >
            <Eye size={16} /> Inspect
          </Link>
          <div className="h-8 w-px bg-gray-800 mx-2 hidden lg:block"></div>
          <VerificationButtons documentId={doc.id} />
        </div>
      </div>
    </div>
  );
}
