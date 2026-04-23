
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const aiSecretaryBlock = `
    ai_secretary: {
      title: "Aura",
      subtitle: "AI Secretary",
      desc: "Aura acts as your 24/7 business manager, handling client inquiries and securing bookings while you focus on the work.",
      status_label: "System Status",
      online: "ONLINE & ACTIVE",
      offline: "OFFLINE / STANDBY",
      knowledge_base_title: "Business Internal Knowledge",
      knowledge_base_desc: "Provide Aura with specific details about your expertise, pricing logic, service procedures, or common client questions.",
      knowledge_placeholder: "e.g. 'I specialize in full-home rewiring...'",
      persona_title: "AI Persona & Tone",
      persona_professional: "Professional",
      persona_friendly: "Friendly",
      persona_concise: "Concise & Fast",
      deploy_button: "Deploy AI Updates",
      impact_title: "AI Business Impact",
      impact_inquiries: "Inquiries Managed",
      impact_revenue: "AI Influenced Revenue",
      impact_conversion: "Conversion optimized",
      security_policy_title: "Security First Policy",
      security_policy_desc: "Aura's training data is proprietary to your merchant node.",
      success_update: "AI Brain updated successfully."
    },
    promotions: {
      title: "Promotion Hub",
      hub: "Overview",
      desc: "Create coupons and discounts that Aura can offer to clients to close deals.",
      referral_btn: "Referral Program Settings",
      success_create: "Coupon created successfully"
    },
    tools: {
      title: "Latest Available Items",
      subtitle: "Modular growth toolkit",
      launch: "Launch Tool",
      diagnosis: { name: "AI Diagnosis", desc: "Visual damage assessment system", badge: "FREE" },
      whatsapp: { name: "WhatsApp", desc: "Instant notifications for new leads", badge: "FREE" },
      seo: { name: "SEO", desc: "Boost Google rankings & optimize metadata", badge: "FREE" },
      ad_copy: { name: "AI Ad Copy", desc: "Generate high-converting ad slogans", badge: "FREE" },
      video: { name: "Elite Video", desc: "Professional video knowledge syncing", badge: "FREE" }
    },`;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Re-adding missing blocks to ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('merchant_dashboard: {')) {
    if (!content.includes('ai_secretary: {') || !content.includes('tools: {')) {
      // Insert after the opening of merchant_dashboard
      content = content.replace('merchant_dashboard: {', 'merchant_dashboard: {' + aiSecretaryBlock);
      console.log(`  Added missing blocks to ${file}`);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
