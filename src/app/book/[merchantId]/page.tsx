"use client";

import { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowRight, CheckCircle2, Loader2, 
  MapPin, Clock, Star, ShieldCheck, Car, Settings, 
  MessageSquare, Briefcase, Camera, ThumbsUp, Info, Home, Zap
} from 'lucide-react';
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { UK_CAR_BRANDS } from "@/data/uk-cars";
import { getServiceDetails, getMerchantDetails } from "@/app/actions/services";
import { getAvailableSlots } from "@/app/actions/availability";
import { finalizeBooking } from "@/app/actions/booking";
import { getVehicles } from "@/app/actions/garage";
import { getUserAssets } from "@/app/actions/profile_actions";
import { useTranslation } from "@/components/LanguageContext";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { t, isRTL } = useTranslation();
  
  const merchantId = params?.merchantId as string;
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  // Personal Data
  const [userAssets, setUserAssets] = useState<{ vehicles: any[], properties: any[] }>({ vehicles: [], properties: [] });
  const [selectedAssetId, setSelectedAssetId] = useState("");
  
  // Real Service Data
  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [merchant, setMerchant] = useState<any>(null);
  
  // Scheduling State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Automotive State
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "" });
  const [property, setProperty] = useState({ address: "", type: "", boilerAge: "" });
  const [serviceType, setServiceType] = useState<"tires" | "mot" | "maintenance" | "repair">("repair");
  const [tireConfig, setTireConfig] = useState({ brand: "Michelin", qty: 2, size: "205/55 R16" });
  const [motAddons, setMotAddons] = useState({ fullCheck: false });

  // Accounting State
  const [accountingData, setAccountingData] = useState({ 
    businessType: "Limited Company", 
    turnover: "£85k-500k", 
    software: "Xero" 
  });
  const [isUrgent, setIsUrgent] = useState(false);

  const serviceId = searchParams?.get("serviceId");
  const fallbackServiceName = searchParams?.get("service") || t.booking.labels.service;
  const fallbackCategory = searchParams?.get("category") || "general";
  const fallbackPrice = searchParams?.get("price") || "£89";
  
  const isSuccessUrl = searchParams?.get("success") === "true";
  const stripeSessionId = searchParams?.get("session_id");

  useEffect(() => {
    async function loadDetails() {
      if (serviceId) {
        const res = await getServiceDetails(serviceId);
        if (res.success && res.service) {
          setService(res.service);
          setMerchant((res.service as any).merchant);
        }
      } else if (merchantId) {
        const res = await getMerchantDetails(merchantId);
        if (res.success && res.merchant) {
          setMerchant(res.merchant);
        }
      }
      setLoadingService(false);
    }
    loadDetails();
  }, [serviceId, merchantId]);

  const serviceName = service?.name || fallbackServiceName;
  const currentCategory = service?.category || fallbackCategory;
  
  const surcharge = (isUrgent && service?.emergencySurchargePercentage) ? (service.price * service.emergencySurchargePercentage / 100) : 0;
  const currentTotalPrice = service ? (service.price + surcharge) : parseFloat(fallbackPrice.replace('£', ''));
  const basePrice = `£${currentTotalPrice.toFixed(2)}`;
  
  const companyName = merchant?.companyName || "ConciergeAI Pro";

  const isAutoMode = currentCategory.toLowerCase().includes("auto") || currentCategory.toLowerCase().includes("car") || currentCategory.toLowerCase().includes("tires") || currentCategory.toLowerCase().includes("mot");
  const isHomeMode = currentCategory.toLowerCase().includes("home") || currentCategory.toLowerCase().includes("plumb") || currentCategory.toLowerCase().includes("electric") || currentCategory.toLowerCase().includes("clean");
  const isAccountingMode = currentCategory.toLowerCase().includes("accounting") || currentCategory.toLowerCase().includes("tax");

  useEffect(() => {
    if (isSuccessUrl && stripeSessionId && !finalizing && !isSuccess) {
      const finalize = async () => {
        setFinalizing(true);
        const res = await finalizeBooking(stripeSessionId);
        if (res.success) {
          setIsSuccess(true);
          setBookingDetails(res);
        } else {
          console.error("Booking finalization failed:", res.error);
        }
        setFinalizing(false);
      };
      finalize();
    }
  }, [isSuccessUrl, stripeSessionId]);

  useEffect(() => {
    async function fetchAssets() {
       const res = await getUserAssets();
       if (res) setUserAssets(res);
    }
    fetchAssets();
  }, []);

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      setLoadingSlots(true);
      try {
        const slots = await getAvailableSlots(merchantId, date);
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2 && !selectedTime) {
      alert(t.booking.labels.time);
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    try {
      const appointmentDate = new Date(`${selectedDate}T${selectedTime}`);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchantId,
          serviceId: serviceId,
          serviceName,
          basePriceStr: basePrice,
          scheduledDate: appointmentDate.toISOString(),
          isUrgent,
          vehicleInfo: isAutoMode ? vehicle : null,
          propertyInfo: isHomeMode ? property : null,
          accountingInfo: isAccountingMode ? accountingData : null
        })
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      alert("Payment Error: " + err.message);
    }
  };

  if (finalizing) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', opacity: 0.5, direction: isRTL ? 'rtl' : 'ltr' }}>
        <Loader2 className="animate-spin" size={64} color="var(--accent-color)" />
        <h2 style={{ marginTop: '1.5rem', fontWeight: 800 }}>{t.booking.messages.finalizing}</h2>
        <p>{t.booking.messages.wait}</p>
      </div>
    );
  }

  if (isSuccessUrl || isSuccess) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem', direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="glass-panel animate-fade-up" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', width: '100%', borderRadius: '24px' }}>
          <div className="animate-scale-in">
            <CheckCircle2 color="#facc15" fill="#ccfbf1" size={80} style={{ margin: '0 auto 1.5rem' }} />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t.booking.titles.success}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '1.1rem' }}>
            {t.booking.messages.contact24h}
          </p>
          
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.5rem', textAlign: isRTL ? 'right' : 'left', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 700 }}>{t.booking.labels.summary}</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.booking.labels.service}</span>
                <span style={{ fontWeight: 700 }}>{serviceName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.booking.labels.merchant}</span>
                <span style={{ fontWeight: 700 }}>{companyName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.booking.labels.time}</span>
                <span style={{ fontWeight: 700 }}>{selectedDate} {selectedTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.booking.labels.paid}</span>
                <span style={{ fontWeight: 900, color: 'var(--accent-color)', fontSize: '1.2rem' }}>{basePrice}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link href="/member" className="btn btn-primary" style={{ width: '100%' }}>{t.booking.buttons.dashboard}</Link>
            <Link href="/" className="btn btn-secondary" style={{ width: '100%' }}>{t.booking.buttons.home}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: '5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      <style jsx>{`
        .booking-main-container {
          display: grid; 
          grid-template-columns: 350px 1fr; 
          gap: 2rem; 
          margin-top: 2rem;
        }
        @media (max-width: 968px) {
          .booking-main-container {
            grid-template-columns: 1fr;
          }
          .summary-col {
            order: -1;
          }
        }
      `}</style>
      
      <div style={{ backgroundColor: 'var(--surface-1)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', position: 'sticky', top: '0px', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '1000px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 800, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--accent-color)' : 'var(--surface-3)', color: step >= 1 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
              <span style={{ fontSize: '1rem' }}>{t.booking.steps.details}</span>
            </div>
            <div style={{ width: '40px', height: '3px', backgroundColor: step >= 2 ? 'var(--accent-color)' : 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 2 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 800, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--accent-color)' : 'var(--surface-3)', color: step >= 2 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
              <span style={{ fontSize: '1rem' }}>{t.booking.steps.schedule}</span>
            </div>
            <div style={{ width: '40px', height: '3px', backgroundColor: step >= 3 ? 'var(--accent-color)' : 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 3 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 800, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--accent-color)' : 'var(--surface-3)', color: step >= 3 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>3</span>
              <span style={{ fontSize: '1rem' }}>{t.booking.steps.confirmation}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container booking-main-container" style={{ gridTemplateColumns: isRTL ? '350px 1fr' : '1fr 350px' }}>
        <div className="form-col" style={{ order: isRTL ? 2 : 1 }}>
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--text-primary)', textAlign: isRTL ? 'right' : 'left' }}>
              {step === 1 && t.booking.titles.details}
              {step === 2 && t.booking.titles.schedule}
              {step === 3 && t.booking.titles.confirm}
            </h1>

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: isRTL ? 'right' : 'left' }}>
                {isAccountingMode ? (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Business Type</label>
                      <select className="input-field" value={accountingData.businessType} onChange={e => setAccountingData({...accountingData, businessType: e.target.value})} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                        <option>Sole Trader</option>
                        <option>Limited Company</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Estimated Turnover</label>
                      <select className="input-field" value={accountingData.turnover} onChange={e => setAccountingData({...accountingData, turnover: e.target.value})} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                        <option>£0-85k</option>
                        <option>£85k-500k</option>
                        <option>£500k+</option>
                      </select>
                    </div>
                  </div>
                ) : isAutoMode ? (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {userAssets.vehicles.length > 0 && (
                      <div style={{ backgroundColor: 'var(--accent-soft)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
                         <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <Car size={16} /> Saved Vehicles
                         </label>
                         <select 
                           className="input-field" 
                           value={selectedAssetId}
                           onChange={(e) => {
                             const v = userAssets.vehicles.find(x => x.id === e.target.value);
                             if (v) {
                               setVehicle({ make: v.make, model: v.model, year: v.year });
                               setSelectedAssetId(v.id);
                             }
                           }}
                           style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                         >
                           <option value="">Select...</option>
                           {userAssets.vehicles.map(v => (
                             <option key={v.id} value={v.id}>{v.make} {v.model} ({v.reg || 'No Reg'})</option>
                           ))}
                         </select>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                         <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{t.booking.labels.make}</label>
                         <input className="input-field" value={vehicle.make} onChange={e => setVehicle({...vehicle, make: e.target.value})} required style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', direction: isRTL ? 'rtl' : 'ltr' }} />
                      </div>
                      <div>
                         <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{t.booking.labels.model}</label>
                         <input className="input-field" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} required style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', direction: isRTL ? 'rtl' : 'ltr' }} />
                      </div>
                    </div>
                  </div>
                ) : isHomeMode ? (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {userAssets.properties.length > 0 && (
                      <div style={{ backgroundColor: 'var(--accent-soft)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
                         <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <Home size={16} /> Saved Properties
                         </label>
                         <select 
                           className="input-field" 
                           value={selectedAssetId}
                           onChange={(e) => {
                             const p = userAssets.properties.find(x => x.id === e.target.value);
                             if (p) {
                               setProperty({ address: p.address, type: p.type, boilerAge: p.boilerAge?.toString() || "" });
                               setSelectedAssetId(p.id);
                             }
                           }}
                           style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                         >
                           <option value="">Select...</option>
                           {userAssets.properties.map(p => (
                             <option key={p.id} value={p.id}>{p.address} ({p.type})</option>
                           ))}
                         </select>
                      </div>
                    )}
                    <div>
                        <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{t.booking.labels.address}</label>
                        <input className="input-field" value={property.address} onChange={e => setProperty({...property, address: e.target.value})} required placeholder="123 Example St, City" style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', direction: isRTL ? 'rtl' : 'ltr' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Property Type</label>
                          <select className="input-field" value={property.type} onChange={e => setProperty({...property, type: e.target.value})} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                            <option value="House">House</option>
                            <option value="Flat">Flat</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Office">Office</option>
                          </select>
                      </div>
                      <div>
                          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t.booking.labels.notes}</label>
                          <input className="input-field" placeholder="..." style={{ direction: isRTL ? 'rtl' : 'ltr' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{t.booking.titles.details}</label>
                    <textarea 
                      className="input-field" 
                      placeholder="..." 
                      rows={5} 
                      required
                      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)', fontSize: '1rem', direction: isRTL ? 'rtl' : 'ltr' }}
                    ></textarea>
                  </div>
                )}

                {service?.isEmergencyAble && (
                  <div className="animate-fade-up" style={{ 
                    marginTop: '0.5rem', 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    border: '1.5px solid ' + (isUrgent ? 'var(--accent-color)' : 'var(--border-color)'),
                    backgroundColor: isUrgent ? 'rgba(212, 175, 55, 0.05)' : 'var(--surface-2)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', 
                          backgroundColor: isUrgent ? 'var(--accent-color)' : 'var(--surface-3)',
                          color: isUrgent ? '#000' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Zap size={16} fill={isUrgent ? '#000' : 'none'} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{t.booking.labels.expressSupport}</div>
                          <div style={{ fontSize: '0.75rem', color: isUrgent ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 600 }}>
                            {service.emergencyResponseTime || t.merchant.fastResponse} • {t.booking.labels.expressSurcharge} {service.emergencySurchargePercentage}%
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsUrgent(!isUrgent)}
                        style={{ 
                          width: '44px', height: '22px', borderRadius: '11px', 
                          backgroundColor: isUrgent ? 'var(--accent-color)' : 'var(--border-color)',
                          position: 'relative', cursor: 'pointer', border: 'none', transition: '0.3s'
                        }}
                      >
                         <div style={{ 
                            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                            position: 'absolute', top: '3px', left: isUrgent ? '25px' : '3px', transition: '0.3s'
                         }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: isRTL ? 'right' : 'left' }}>
                 <div>
                    <label style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>{t.booking.labels.date}</label>
                    <input type="date" value={selectedDate} onChange={e => handleDateChange(e.target.value)} className="input-field" required style={{ fontSize: '1.1rem', padding: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', direction: isRTL ? 'rtl' : 'ltr' }} />
                 </div>
                 {selectedDate && (
                    <div className="animate-fade-up">
                       <label style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>{t.booking.labels.time}</label>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                          {availableSlots.map(slot => (
                             <button key={slot} type="button" onClick={() => setSelectedTime(slot)} style={{ padding: '1.2rem', borderRadius: '14px', border: '2px solid ' + (selectedTime === slot ? 'var(--accent-color)' : 'var(--border-color)'), backgroundColor: selectedTime === slot ? 'var(--accent-color)' : 'var(--bg-primary)', color: selectedTime === slot ? 'white' : 'var(--text-primary)', fontWeight: 900, fontSize: '1rem', transition: 'all 0.2s', boxShadow: selectedTime === slot ? '0 4px 12px rgba(59,130,246,0.3)' : 'none' }}>
                                {slot}
                             </button>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
            )}

            {step === 3 && (
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--accent-color)', padding: '2rem', borderRadius: '16px', textAlign: isRTL ? 'right' : 'left' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: 600 }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>{isRTL ? 'تنبيه هام' : 'Important'}:</strong> {t.booking.messages.safety}
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: 'var(--text-primary)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                   <input type="checkbox" required style={{ width: '22px', height: '22px', accentColor: 'var(--accent-color)' }} />
                   <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{t.booking.labels.agree}</span>
                </label>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">{t.booking.buttons.prev}</button>
              )}
              <div style={{ flex: 1 }} />
               <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: '14px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 {isLoading ? "..." : step === 3 ? t.booking.buttons.pay : t.booking.buttons.next}
                 {!isLoading && step < 3 && <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
               </button>
            </div>
          </form>
        </div>

        <div className="summary-col" style={{ order: isRTL ? 1 : 2 }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', position: 'sticky', top: '100px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', textAlign: isRTL ? 'right' : 'left' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t.booking.labels.summary}</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700 }}>{t.booking.labels.service}</div>
                   <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.15rem' }}>{serviceName}</div>
                </div>
                <div>
                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{t.booking.labels.merchant}</div>
                   <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{companyName}</div>
                </div>
                
                {merchant?.documents?.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Verified</div>
                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                      {merchant.documents.map((doc: any) => (
                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0f766e', fontWeight: 600, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <CheckCircle2 size={16} fill="#ccfbf1" /> {doc.type.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px dashed #22c55e', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>{t.common.escrow.fees}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#16a34a' }}>£0.00</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: '0.2rem', textAlign: isRTL ? 'right' : 'left' }}>
                      {t.common.escrow.title}
                    </div>
                  </div>

                 <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 800 }}>{t.booking.labels.paid}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '-0.03em' }}>{basePrice}</div>
                 </div>
                 <div style={{ padding: '1.25rem', backgroundColor: 'var(--accent-soft)', borderRadius: '14px', fontSize: '0.9rem', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--accent-color)', fontWeight: 800, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                   <ShieldCheck size={20} />
                   <span>{t.booking.messages.safety}</span>
                </div>

                <Link 
                  href={`/member/chat?merchantId=${merchantId}`}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                >
                  <MessageSquare size={18} /> Ask Expert
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Work Portfolio showcase handled by merchant profile or results, typically. 
          Truncated here for brevity but following same logic. */}
    </div>
  );
}
