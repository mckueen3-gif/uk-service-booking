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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '1.5rem', 
        border: '1px solid #e2e8f0', 
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.025em' }}>
            <CalendarDays style={{ color: '#d4af37' }} />
            Booking Command Hub
          </h2>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, margin: 0, fontFamily: 'monospace' }}>Neural Booking Registry</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Customer, Expert..." 
              style={{ 
                paddingLeft: '40px', 
                paddingRight: '16px', 
                paddingTop: '10px', 
                paddingBottom: '10px', 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '0.75rem', 
                fontSize: '12px', 
                color: '#0f172a',
                outline: 'none',
                width: '260px'
              }}
            />
          </div>
          <button style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Transaction ID / Sector</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Parties</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Financials</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Lifecycle</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Admin Control</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>#{booking.id.slice(-8).toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '8px', 
                      fontWeight: 900, 
                      letterSpacing: '0.1em', 
                      textTransform: 'uppercase',
                      backgroundColor: booking.isEducation ? 'rgba(59, 130, 246, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                      color: booking.isEducation ? '#3b82f6' : '#d4af37',
                      border: booking.isEducation ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                      {booking.isEducation ? 'Education' : 'Field Service'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                      {booking.customer.name}
                      <ArrowRightLeft size={10} style={{ color: '#94a3b8' }} />
                      {booking.merchant.companyName}
                    </p>
                    <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, margin: 0 }}>{booking.customer.email}</p>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#d4af37' }}>
                      <Wallet size={14} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>£{booking.totalAmount.toFixed(2)}</p>
                      <p style={{ fontSize: '9px', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px', margin: 0 }}>Fee: £{booking.platformFee.toFixed(2)}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <StatusBadge status={booking.status} />
                  <p style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', margin: 0 }}>Sch: {format(new Date(booking.scheduledDate), 'MMM dd, HH:mm')}</p>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
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
  const styles: Record<string, { bg: string, text: string, border: string }> = {
    PENDING: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316', border: '1px solid rgba(249,115,22,0.2)' },
    CONFIRMED: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' },
    COMPLETED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '1px solid rgba(16,185,129,0.2)' },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' },
  };

  const style = styles[status] || styles.PENDING;

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px', 
      padding: '4px 10px', 
      borderRadius: '99px', 
      fontSize: '10px', 
      fontWeight: 900, 
      backgroundColor: style.bg,
      color: style.text,
      border: style.border,
      textTransform: 'uppercase', 
      letterSpacing: '0.1em'
    }}>
      {status === 'COMPLETED' ? <CheckCircle2 size={12} /> : status === 'CANCELLED' ? <XCircle size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}
