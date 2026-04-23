"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Share2, Sparkles, Rocket, Crown, Copy, Check, 
  MessageSquare, ArrowLeft, Loader2, Star, Quote,
  Globe, Zap, ImageIcon,
  ChevronRight, CheckCircle2, Send, PenLine,
  Megaphone, Tag, Users, RefreshCw, Briefcase, MessageCircle
} from "lucide-react";

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.734l7.73-8.835L1.254 2.25H8.08l4.261 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const RedditIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const WeChatIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M8.28 12.65c0-.42-.31-.76-.69-.76s-.69.34-.69.76.31.76.69.76.69-.34.69-.76zm3.32 0c0-.42-.31-.76-.69-.76s-.69.34-.69.76.31.76.69.76.69-.34.69-.76zM15.4 6.13c-2.48 0-4.5 1.83-4.5 4.1 0 2.27 2.02 4.1 4.5 4.1.48 0 .95-.08 1.38-.22l1.24.71-.31-1.12c1.02-.79 1.69-1.97 1.69-3.27 0-2.47-2.02-4.3-4.5-4.3zm-.69 2.76c-.31 0-.58.23-.58.5s.27.5.58.5.58-.23.58-.5-.27-.5-.58-.5zm2.08 0c-.31 0-.58.23-.58.5s.27.5.58.5.58-.23.58-.5-.27-.5-.58-.5zM7.5 2C3.36 2 0 4.88 0 8.44c0 2.05 1.11 3.86 2.8 5.12L2.1 16.5l3.24-1.62c.69.18 1.41.28 2.16.28.42 0 .84-.04 1.25-.11-.11-.3-.17-.63-.17-.97 0-2.88 2.62-5.23 5.85-5.23.41 0 .8.04 1.18.11C15.02 5.06 12.44 2 7.5 2z" />
  </svg>
);

import { useTranslation } from "@/components/LanguageContext";
import { generateOmnichannelCampaign, publishSocialPosts, generateSocialPost, optimizeExistingContent, generateVisualPost } from "@/app/actions/social_toolkit";
import { getMerchantReviews } from "@/app/actions/review";
import { getSocialAccountStatus, incrementSocialUsage, upgradeToPro } from "@/app/actions/social_persistence";
import Link from "next/link";

type PlatformKey = 'igfb' | 'x' | 'linkedin' | 'wechat';

const PLATFORMS = [
  { key: 'igfb' as PlatformKey, label: 'Instagram / Facebook', icon: <InstagramIcon size={16} />, color: '#e1306c', bg: 'rgba(225,48,108,0.1)' },
  { key: 'x' as PlatformKey, label: 'X (Twitter)', icon: <XIcon size={16} />, color: '#1d9bf0', bg: 'rgba(29,155,240,0.1)' },
  { key: 'linkedin' as PlatformKey, label: 'LinkedIn', icon: <Briefcase size={16} />, color: '#0a66c2', bg: 'rgba(10,102,194,0.1)' },
  { key: 'wechat' as PlatformKey, label: 'WeChat Moments', icon: <MessageCircle size={16} />, color: '#07c160', bg: 'rgba(7,193,96,0.1)' },
];

export default function SocialToolkitPage() {
  const { t, locale } = useTranslation();

  // Campaign Creator state
  const [topic, setTopic] = useState('');
  const [discount, setDiscount] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingPhase, setGeneratingPhase] = useState('');
  const [campaign, setCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<PlatformKey>('igfb');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformKey>>(new Set(['igfb', 'x', 'reddit', 'wechat']));
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Subscription & Credit state
  const [accountStatus, setAccountStatus] = useState<any>({ isPro: false, used: 0, limit: 2, remaining: 2 });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Editable Campaign Content
  const [editableTexts, setEditableTexts] = useState<any>({
    igfb: '',
    x: '',
    reddit: '',
    wechat: '',
    hashtags: ''
  });
  const [optimizingPlatform, setOptimizingPlatform] = useState<string | null>(null);
  
  // Legacy review-based generator state
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [mode, setMode] = useState<'viral' | 'luxury'>('viral');
  const [legacyPost, setLegacyPost] = useState<any>(null);
  const [legacyCopied, setLegacyCopied] = useState(false);
  const [legacyGenerating, setLegacyGenerating] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [view, setView] = useState<'campaign' | 'review' | 'magic'>('campaign');

  // Visual Magic state
  const [magicGenerating, setMagicGenerating] = useState(false);
  const [magicPlatform, setMagicPlatform] = useState('igfb');
  const [magicPost, setMagicPost] = useState<any>(null);
  const [magicReferenceImage, setMagicReferenceImage] = useState<string | null>(null);
  const [magicReferenceImageMime, setMagicReferenceImageMime] = useState<string>('image/jpeg');
  const [magicImageLoaded, setMagicImageLoaded] = useState(false);

  const phases = [
    'Analysing your business context...',
    'Writing IG/FB post...',
    'Crafting X-optimised post...',
    'Composing Reddit story...',
    'Generating campaign image...',
    'Finalising your content package...'
  ];

  const loadStatus = async () => {
    const status = await getSocialAccountStatus();
    if (!status.error) setAccountStatus(status);
  };

  useEffect(() => {
    async function load() {
      const res = await getMerchantReviews();
      if (res.merchant?.reviews) setReviews(res.merchant.reviews);
      setLoadingReviews(false);
      loadStatus();
    }
    load();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (accountStatus.remaining <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setGenerating(true);
    setPublishSuccess(false);
    setCampaign(null);
    setImageLoaded(false);
    
    // Cycle through phases  
    for (let i = 0; i < phases.length; i++) {
      setGeneratingPhase(phases[i]);
      await new Promise(res => setTimeout(res, 600));
    }
    
    // Pass current site language to AI
    const res = await generateOmnichannelCampaign(topic, discount || undefined, targetAudience || undefined, locale);
    
    if (!('error' in res) || !res.error) {
      if (res.campaign) {
        setCampaign(res.campaign);
        // Initialize editables
        setEditableTexts({
          igfb: res.campaign.igFbPost,
          x: res.campaign.xPost,
          reddit: res.campaign.redditPost,
          wechat: res.campaign.wechatMoments,
          hashtags: res.campaign.hashtags
        });
      }
      // Deduct credit in DB
      await incrementSocialUsage();
      loadStatus();
    } else {
      alert((res as any).error || 'Failed to generate campaign.');
    }
    setGenerating(false);
    setGeneratingPhase('');
  };

  const handleOptimizeAction = async (platformKey: PlatformKey) => {
    const currentText = editableTexts[platformKey];
    if (!currentText) return;

    setOptimizingPlatform(platformKey);
    const res = await optimizeExistingContent(currentText, platformKey, locale);
    
    if (res.success && res.optimizedText) {
      setEditableTexts((prev: any) => ({ ...prev, [platformKey]: res.optimizedText }));
    } else {
      alert("Optimization failed. Please try again.");
    }
    setOptimizingPlatform(null);
  };

  const handleUpgradeAccount = async () => {
    setUpgrading(true);
    const res = await upgradeToPro();
    if (res.success) {
      alert(t('Account upgraded to Pro! Enjoy 60 generations per month.'));
      await loadStatus();
      setShowUpgradeModal(false);
    } else {
      alert(res.error || "Upgrade failed.");
    }
    setUpgrading(false);
  };
  
  const handleGenerateMagic = async () => {
    if (!magicPrompt.trim()) return;
    if (accountStatus.remaining <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setMagicGenerating(true);
    const refImageData = magicReferenceImage ? { 
      base64: magicReferenceImage.split(',')[1], 
      mimeType: magicReferenceImageMime 
    } : undefined;

    const res = await generateVisualPost(magicPrompt, locale, magicPlatform, refImageData);

    if (res.success && res.post) {
      setMagicPost(res.post);
      await incrementSocialUsage();
      loadStatus();
    } else {
      alert(res.error || "Generation failed.");
    }
    setMagicGenerating(false);
  };

  const handleNativeShare = async () => {
    if (!campaign) return;
    try {
      const text = getCampaignText(activeTab);
      const hashtags = campaign.hashtags || "";
      const shareData: any = {
        title: 'Promotion from ConciergeAI',
        text: `${text}\n\n${hashtags}`,
        url: 'https://conciergeai.uk'
      };

      if (navigator.share) {
        // Try sharing the image too if possible
        try {
          const response = await fetch(campaign.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'promo.jpg', { type: 'image/jpeg' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch (e) {
          console.log("File share not supported, sharing text only");
        }
        await navigator.share(shareData);
      } else {
        handleCopy(activeTab, `${text}\n\n${hashtags}`);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const downloadImage = async () => {
    if (!campaign) return;
    const response = await fetch(campaign.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `concierge-promo-${Date.now()}.jpg`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const togglePlatform = (key: PlatformKey) => {
    setSelectedPlatforms((prev: Set<PlatformKey>) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const handlePublish = async () => {
    if (!campaign) return;
    setPublishing(true);
    await publishSocialPosts({ platforms: Array.from(selectedPlatforms), imageUrl: campaign.imageUrl });
    setPublishing(false);
    setPublishSuccess(true);
  };

  const handleLegacyGenerate = async () => {
    setLegacyGenerating(true);
    const res = await generateSocialPost(mode, selectedReview || undefined);
    if (!res.error) setLegacyPost(res);
    else alert(res.error);
    setLegacyGenerating(false);
  };

  const getCampaignText = (platform: PlatformKey) => {
    if (!campaign) return '';
    if (platform === 'igfb') return campaign.igFbPost;
    if (platform === 'x') return campaign.xPost;
    if (platform === 'reddit') return campaign.redditPost;
    if (platform === 'wechat') return campaign.wechatMoments;
    return '';
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1300px', margin: '0 auto', color: 'var(--text-primary)', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/merchant/toolkit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> {t?.merchant?.toolkit?.back || "Back to Toolkit"}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #e1306c, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(225,48,108,0.4)' }}>
            <Megaphone size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, background: 'linear-gradient(135deg, #e1306c, #f472b6, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t?.merchant?.toolkit?.social?.title || "Social Media Campaign Studio"}
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.95rem' }}>
              {t?.merchant?.toolkit?.social?.desc || "AI-powered omnichannel promotions — crafted, imaged, and published in seconds."}
            </p>
          </div>

          {/* Usage Tracker */}
          <div style={{ marginLeft: 'auto', background: 'var(--surface-1)', padding: '0.75rem 1.25rem', borderRadius: '18px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>{t?.merchant?.toolkit?.social?.monthly_quota || "Monthly Quota"}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: accountStatus.remaining > 0 ? '#10b981' : '#ef4444' }}>
                {t?.merchant?.toolkit?.social?.quota_left?.replace('{count}', accountStatus.remaining.toString()) || `${accountStatus.remaining} / ${accountStatus.limit} Left`}
              </div>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
            <button 
              onClick={() => !accountStatus.isPro && setShowUpgradeModal(true)}
              style={{ background: accountStatus.isPro ? 'rgba(212,175,55,0.1)' : 'linear-gradient(135deg, #d4af37, #f59e0b)', border: accountStatus.isPro ? '1px solid #d4af37' : 'none', color: accountStatus.isPro ? '#d4af37' : 'white', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: accountStatus.isPro ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Crown size={14} /> {accountStatus.isPro ? (t?.merchant?.toolkit?.social?.pro_status || "PRO STATUS ACTIVE") : (t?.merchant?.toolkit?.social?.upgrade_plan || "Upgrade Plan")}
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '1.75rem', background: 'var(--surface-1)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
          {[
            { key: 'campaign', label: t?.merchant?.toolkit?.social?.tab_campaign || "Campaign Creator", icon: <Megaphone size={15} /> },
            { key: 'magic', label: t?.merchant?.toolkit?.social?.visual_magic?.tab_label || "Visual Magic", icon: <Sparkles size={15} /> },
            { key: 'review', label: t?.merchant?.toolkit?.social?.tab_review || "Review Booster", icon: <Star size={15} /> }
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key as any)} style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: view === v.key ? 'linear-gradient(135deg, #e1306c, #f472b6)' : 'transparent', color: view === v.key ? 'white' : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CAMPAIGN CREATOR VIEW ─── */}
      {view === 'campaign' && (
        <div style={{ display: 'grid', gridTemplateColumns: campaign ? '420px 1fr' : '1fr', gap: '2.5rem', transition: 'all 0.4s' }}>
          
          {/* LEFT: Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Topic Input */}
            <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <PenLine size={18} color="#f472b6" /> {t?.merchant?.toolkit?.social?.title || "Social Media Campaign Studio"}
              </h3>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder={t?.merchant?.toolkit?.social?.topic_placeholder || "Describe what you want to promote..."}
                style={{ width: '100%', minHeight: '140px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Tag size={13} /> {t?.merchant?.toolkit?.social?.discount_label || "Discount / Offer (Optional)"}
                  </label>
                  <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} placeholder={t?.merchant?.toolkit?.social?.discount_placeholder || "e.g. 20% off this week"} style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Users size={13} /> {t?.merchant?.toolkit?.social?.audience_label || "Target Audience (Optional)"}
                  </label>
                  <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder={t?.merchant?.toolkit?.social?.audience_placeholder || "e.g. London homeowners"} style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              style={{ padding: '1.1rem', borderRadius: '18px', background: !topic.trim() ? 'var(--surface-1)' : 'linear-gradient(135deg, #e1306c, #f472b6)', color: !topic.trim() ? 'var(--text-muted)' : 'white', border: !topic.trim() ? '1px solid var(--border-color)' : 'none', fontSize: '1rem', fontWeight: 800, cursor: !topic.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: topic.trim() ? '0 8px 24px rgba(225,48,108,0.4)' : 'none', transition: 'all 0.3s' }}
            >
              {generating ? <><Loader2 className="animate-spin" size={20} /> {generatingPhase}</> : <><Sparkles size={20} /> {t?.merchant?.toolkit?.social?.generate_cta || "✨ Generate My Campaign"}</>}
            </button>

            {/* Platform Selector (shown when campaign exists) */}
            {campaign && (
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} color="#f472b6" /> {t?.merchant?.toolkit?.social?.publish_to || "Publish To"}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PLATFORMS.map(p => (
                    <button key={p.key} onClick={() => togglePlatform(p.key)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', borderRadius: '14px', border: `1px solid ${selectedPlatforms.has(p.key) ? p.color : 'var(--border-color)'}`, background: selectedPlatforms.has(p.key) ? p.bg : 'transparent', cursor: 'pointer', transition: 'all 0.2s', color: selectedPlatforms.has(p.key) ? p.color : 'var(--text-secondary)' }}>
                      <span style={{ color: selectedPlatforms.has(p.key) ? p.color : 'var(--text-muted)' }}>{p.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.label}</span>
                      {selectedPlatforms.has(p.key) && <CheckCircle2 size={16} style={{ marginLeft: 'auto' }} />}
                    </button>
                  ))}
                </div>
                {publishSuccess ? (
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
                    <CheckCircle2 size={20} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t?.merchant?.toolkit?.social?.success || "Campaign Scheduled! 🎉"}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{t?.merchant?.toolkit?.social?.ayrshare_note || "Your posts are queued via the Ayrshare network."}</div>
                    </div>
                  </div>
                ) : (
                  <button onClick={handlePublish} disabled={publishing || selectedPlatforms.size === 0} style={{ marginTop: '1.25rem', width: '100%', padding: '1rem', borderRadius: '14px', background: selectedPlatforms.size > 0 ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'var(--surface-2)', color: selectedPlatforms.size > 0 ? 'white' : 'var(--text-muted)', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: selectedPlatforms.size > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: selectedPlatforms.size > 0 ? '0 8px 24px rgba(124,58,237,0.35)' : 'none', transition: 'all 0.3s' }}>
                    {publishing ? <><Loader2 className="animate-spin" size={18} /> {t?.merchant?.toolkit?.social?.ayrshare_status || "Publishing via Ayrshare..."}</> : <><Rocket size={18} /> {t?.merchant?.toolkit?.social?.publish_cta?.replace('{count}', selectedPlatforms.size.toString()) || `🚀 Publish to ${selectedPlatforms.size} Platforms`}</>}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Campaign Preview */}
          {campaign && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* AI Generated Image */}
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={16} color="#f472b6" /> {t?.merchant?.toolkit?.social?.ai_image || "AI-Generated Campaign Image"}
                  </h3>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.1)', color: '#d4af37', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>{t?.merchant?.toolkit?.social?.ready || "READY TO DOWNLOAD"}</span>
                </div>
                <div style={{ position: 'relative', background: 'var(--bg-secondary)', aspectRatio: '1/1', overflow: 'hidden' }}>
                  {!imageLoaded && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                      <Loader2 className="animate-spin" size={32} color="#f472b6" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t?.merchant?.toolkit?.social?.painting || "AI is painting your image..."}</span>
                    </div>
                  )}
                  {campaign.imageUrl && (
                    <img
                      src={campaign.imageUrl}
                      alt="AI Campaign Image"
                      onLoad={() => setImageLoaded(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                    />
                  )}
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '10px' }}>
                  <a
                    href={campaign.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="campaign-image.jpg"
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <ImageIcon size={16} /> {t?.merchant?.toolkit?.social?.full_size || "Open Full Size"}
                  </a>
                  <button onClick={handleGenerate} style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Regenerate">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Post Tabs */}
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                {/* Tab Bar */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                  {PLATFORMS.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setActiveTab(p.key)}
                      style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === p.key ? p.bg : 'transparent', color: activeTab === p.key ? p.color : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', borderBottom: activeTab === p.key ? `2px solid ${p.color}` : '2px solid transparent' }}
                    >
                      {p.icon} 
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {p.key === 'igfb' ? 'IG / FB' : p.key === 'x' ? 'X' : p.key === 'wechat' ? 'WeChat' : 'Reddit'}
                      </span>
                    </button>
                  ))}
                </div>
                
                 {/* Tab Content */}
                <div style={{ padding: '1.5rem' }}>
                  {PLATFORMS.map(p => activeTab === p.key && (
                    <div key={p.key}>
                      <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <textarea
                          value={editableTexts[p.key]}
                          onChange={(e) => setEditableTexts((prev: any) => ({ ...prev, [p.key]: e.target.value }))}
                          style={{ width: '100%', minHeight: '220px', background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.25rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)', border: `1px solid ${p.color}44`, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleOptimizeAction(p.key)}
                            disabled={optimizingPlatform === p.key}
                            style={{ fontSize: '0.7rem', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, border: '1px solid #7c3aed33', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {optimizingPlatform === p.key ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                            {t?.merchant?.toolkit?.social?.ai_optimize || "AI Optimize"}
                          </button>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: p.color, background: p.bg, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', border: `1px solid ${p.color}22` }}>
                            {p.label}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={handleNativeShare}
                          style={{ flex: 1.5, padding: '0.85rem', borderRadius: '12px', background: 'linear-gradient(135deg, #e1306c, #f472b6)', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(225,48,108,0.2)' }}
                        >
                          <Share2 size={16} /> {t?.merchant?.toolkit?.social?.post_to || "Post to"} {p.key === 'igfb' ? 'Instagram' : p.key === 'x' ? 'X (Twitter)' : p.key === 'wechat' ? 'WeChat' : 'Reddit'}
                        </button>
                        <button
                          onClick={() => handleCopy(p.key, editableTexts[p.key])}
                          style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', background: copiedPlatform === p.key ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)', border: `1px solid ${copiedPlatform === p.key ? 'rgba(16,185,129,0.25)' : 'var(--border-color)'}`, color: copiedPlatform === p.key ? '#10b981' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          {copiedPlatform === p.key ? <><Check size={16} /> {t?.merchant?.toolkit?.social?.done || "Done"}</> : <><Copy size={16} /> {t?.merchant?.toolkit?.social?.copy_text || "Copy Text"}</>}
                        </button>
                        <button
                          onClick={downloadImage}
                          style={{ padding: '0.85rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Save Image"
                        >
                          <ImageIcon size={18} />
                        </button>
                      </div>

                       {/* Hashtags Section */}
                      {editableTexts.hashtags && (
                        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(212,175,55,0.05)', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Tag size={12} /> {t?.merchant?.toolkit?.social?.suggested_hashtags || "Suggested SEO Hashtags"}
                          </div>
                          <textarea
                            value={editableTexts.hashtags}
                            onChange={(e) => setEditableTexts((prev: any) => ({ ...prev, hashtags: e.target.value }))}
                            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', outline: 'none', resize: 'none', fontFamily: 'inherit', minHeight: '40px' }}
                          />
                          <button 
                            onClick={() => { navigator.clipboard.writeText(editableTexts.hashtags); alert(t("Hashtags copied!")); }}
                            style={{ marginTop: '8px', background: 'transparent', border: 'none', color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                          >
                            {t?.merchant?.toolkit?.social?.copy_hashtags || "Copy Hashtags Only"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Empty state when no campaign */}
          {!campaign && !generating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '6rem 2rem', textAlign: 'center', background: 'var(--surface-1)', borderRadius: '28px', border: '1px dashed var(--border-color)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(225,48,108,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={40} color="#e1306c" style={{ opacity: 0.5 }} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Describe your job or promotion above and hit</p>
                <p style={{ color: '#f472b6', fontWeight: 800, fontSize: '1.1rem', margin: '4px 0 0' }}>✨ Generate My Campaign</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', width: '100%', maxWidth: '420px' }}>
                {['IG / Facebook Post', 'X (Twitter) Post', 'Reddit Story'].map((item, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {i === 0 && <InstagramIcon size={13} />}
                    {i === 1 && <XIcon size={13} />}
                    {i === 2 && <RedditIcon size={13} />}
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── VISUAL MAGIC VIEW ─── */}
      {view === 'magic' && (
        <div style={{ display: 'grid', gridTemplateColumns: magicPost ? '420px 1fr' : '1fr', gap: '2.5rem', transition: 'all 0.4s' }}>
          {/* Left Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Sparkles size={18} color="#f472b6" /> {t?.merchant?.toolkit?.social?.visual_magic?.title || "AI Visual Content Generator"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {t?.merchant?.toolkit?.social?.visual_magic?.desc || "Describe your post and our AI will create a stunning image and perfectly tailored caption."}
              </p>
              
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                {t?.merchant?.toolkit?.social?.visual_magic?.prompt_label || "What's the post about?"}
              </label>
              <textarea
                value={magicPrompt}
                onChange={e => setMagicPrompt(e.target.value)}
                placeholder={t?.merchant?.toolkit?.social?.visual_magic?.prompt_placeholder || "e.g. A futuristic plumber fixing a gold pipe..."}
                style={{ width: '100%', minHeight: '100px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />

              {/* Reference Image Upload */}
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                  {t?.merchant?.toolkit?.social?.visual_magic?.ref_label || "Reference Image (Optional)"}
                </label>
                {!magicReferenceImage ? (
                  <div 
                    onClick={() => document.getElementById('magic-ref-upload')?.click()}
                    style={{ height: '80px', border: '2px dashed var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)', cursor: 'pointer', background: 'var(--bg-secondary)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#f472b6'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <ImageIcon size={20} />
                    <span style={{ fontSize: '0.85rem' }}>Upload Reference Graphic</span>
                    <input 
                      id="magic-ref-upload" 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setMagicReferenceImageMime(file.type);
                          const reader = new FileReader();
                          reader.onloadend = () => setMagicReferenceImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={magicReferenceImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      onClick={() => setMagicReferenceImage(null)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', marginTop: '1.5rem' }}>
                {t?.merchant?.toolkit?.social?.target_platform || "Target Platform"}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setMagicPlatform(p.key)}
                    style={{ 
                      padding: '10px 4px', 
                      borderRadius: '12px', 
                      border: magicPlatform === p.key ? `2px solid ${p.color}` : '1px solid var(--border-color)', 
                      background: magicPlatform === p.key ? p.bg : 'var(--bg-secondary)',
                      color: magicPlatform === p.key ? p.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.key === 'igfb' && <InstagramIcon size={14} />}
                    {p.key === 'x' && <XIcon size={14} />}
                    {p.key === 'linkedin' && <Briefcase size={14} />}
                    {p.key === 'wechat' && <MessageCircle size={14} />}
                    {p.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleGenerateMagic}
                disabled={magicGenerating || !magicPrompt.trim()}
                style={{ marginTop: '1.5rem', width: '100%', padding: '1.1rem', borderRadius: '16px', background: magicPrompt.trim() ? 'linear-gradient(135deg, #e1306c, #f472b6)' : 'var(--surface-2)', color: magicPrompt.trim() ? 'white' : 'var(--text-muted)', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: magicPrompt.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: magicPrompt.trim() ? '0 10px 25px rgba(225,48,108,0.3)' : 'none', transition: 'all 0.3s' }}
              >
                {magicGenerating ? <><Loader2 className="animate-spin" size={20} /> {t?.merchant?.toolkit?.social?.painting || "AI is painting..."}</> : <><Sparkles size={20} /> {t?.merchant?.toolkit?.social?.visual_magic?.generate_btn || "Generate Visual Post"}</>}
              </button>
            </div>
          </div>

          {/* Right Result */}
          {magicPost ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', background: 'var(--bg-secondary)', aspectRatio: '1/1' }}>
                   {!magicImageLoaded && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Loader2 className="animate-spin" size={32} color="#f472b6" />
                    </div>
                  )}
                  <img 
                    src={magicPost.imageUrl} 
                    alt="Magic AI Image" 
                    onLoad={() => setMagicImageLoaded(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: magicImageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
                  />
                </div>
                <div style={{ padding: '1.75rem' }}>
                   <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {magicPost.caption}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleCopy('magic', magicPost.caption)}
                      style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: 'var(--text-primary)', color: 'var(--surface-1)', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {copiedPlatform === 'magic' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      {copiedPlatform === 'magic' ? t?.merchant?.toolkit?.social?.done || "Done" : t?.merchant?.toolkit?.social?.copy_text || "Copy Text"}
                    </button>
                    <a 
                      href={magicPost.imageUrl} 
                      target="_blank" 
                      download 
                      style={{ padding: '0.9rem 1.25rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ImageIcon size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : !magicGenerating && (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '24px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t?.merchant?.toolkit?.social?.visual_magic?.empty_state || "Enter a prompt and let the AI build your next viral post."}
            </div>
          )}
        </div>
      )}

      {/* ─── REVIEW BOOSTER VIEW ─── */}
      {view === 'review' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {loadingReviews ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gridColumn: '1/-1' }}>
              <Loader2 className="animate-spin" size={28} color="#f472b6" />
            </div>
          ) : (<>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Mode Selector */}
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Rocket size={18} color="#f472b6" /> {t?.merchant?.toolkit?.social?.review_booster?.style_title || "Content Style"}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {(['viral', 'luxury'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{ padding: '1.25rem', borderRadius: '20px', border: mode === m ? `2px solid ${m === 'viral' ? '#f472b6' : '#d4af37'}` : '1px solid var(--border-color)', backgroundColor: mode === m ? `rgba(${m === 'viral' ? '244,114,182' : '212,175,55'},0.1)` : 'var(--surface-1)', color: mode === m ? (m === 'viral' ? '#f472b6' : '#d4af37') : 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>{m === 'viral' ? (t?.merchant?.toolkit?.social?.review_booster?.viral_title || '⚡ Viral Hype') : (t?.merchant?.toolkit?.social?.review_booster?.luxury_title || '👑 Quiet Luxury')}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{m === 'viral' ? (t?.merchant?.toolkit?.social?.review_booster?.viral_desc || 'High energy, emoji-rich, bold hooks.') : (t?.merchant?.toolkit?.social?.review_booster?.luxury_desc || 'Sophisticated, professional, premium.')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} color="#f472b6" /> {t?.merchant?.toolkit?.social?.review_booster?.amplify_title || "Amplify a 5-Star Review"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{t?.merchant?.toolkit?.social?.review_booster?.amplify_desc || "Select a review to base the post on (optional)"}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {reviews.filter(r => r.rating >= 4).map(r => (
                    <div key={r.id} onClick={() => setSelectedReview(selectedReview === r.id ? null : r.id)} style={{ padding: '1rem', borderRadius: '14px', border: selectedReview === r.id ? '1px solid #f472b6' : '1px solid var(--border-color)', background: selectedReview === r.id ? 'rgba(244,114,182,0.05)' : 'var(--bg-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="#f472b6" color="#f472b6" />)}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '0 0 6px', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{r.comment}"</p>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>— {r.customer?.name}</div>
                    </div>
                  ))}
                  {reviews.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '14px' }}>No high-rated reviews available yet.</div>}
                </div>
              </div>

              <button onClick={handleLegacyGenerate} disabled={legacyGenerating} style={{ padding: '1rem', borderRadius: '18px', background: 'linear-gradient(135deg, #e1306c, #f472b6)', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(225,48,108,0.35)', transition: 'all 0.2s' }}>
                {legacyGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {t?.merchant?.toolkit?.social?.review_booster?.generate_btn || "Generate Social Post"}
              </button>
            </section>

            <section>
              <div style={{ background: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Crown size={18} color="#f472b6" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t?.merchant?.toolkit?.social?.review_booster?.result_title || "Your Generated Post"}</span>
                </div>
                {legacyPost ? (
                  <div style={{ padding: '1.75rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem', color: '#f472b6' }}>{legacyPost.headline}</h4>
                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '20px', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1.5rem', position: 'relative' }}>
                      <Quote size={36} color="var(--border-color)" style={{ position: 'absolute', top: 10, left: 10, opacity: 0.2 }} />
                      {legacyPost.caption}
                      <div style={{ marginTop: '1rem', color: '#f472b6', fontWeight: 700 }}>
                        {legacyPost.suggestedHashtags?.join(' ')}
                      </div>
                    </div>
                    {legacyPost.expertTip && (
                      <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '1rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', marginBottom: '4px' }}>{t?.merchant?.toolkit?.social?.review_booster?.expert_tip || "💡 Expert Tip"}</div>
                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{legacyPost.expertTip}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { navigator.clipboard.writeText(`${legacyPost.headline}\n\n${legacyPost.caption}\n\n${legacyPost.suggestedHashtags?.join(' ')}`); setLegacyCopied(true); setTimeout(() => setLegacyCopied(false), 2000); }} style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.875rem' }}>
                        {legacyCopied ? <><Check size={16} color="#10b981" /> Copied!</> : <><Copy size={16} /> Copy Post</>}
                      </button>
                      <button onClick={() => { const text = `${legacyPost.headline}\n\n${legacyPost.caption}\n\n${legacyPost.suggestedHashtags?.join(' ')}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); }} style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Sparkles size={48} color="var(--border-color)" style={{ marginBottom: '1.5rem' }} />
                    <p>{t?.merchant?.toolkit?.social?.review_booster?.empty_state || "Select a style and click Generate to create a post based on your reviews."}</p>
                  </div>
                )}
              </div>
            </section>
          </>)}
        </div>
      )}
      {/* ─── UPGRADE MODAL ─── */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface-1)', borderRadius: '32px', border: '1px solid #d4af3733', width: '100%', maxWidth: '480px', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Crown size={32} color="#d4af37" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t?.merchant?.toolkit?.social?.upgrade?.title || "Unlock Unlimited Studio"}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {t?.merchant?.toolkit?.social?.upgrade?.desc || "Reached your free limit? Upgrade to **Concierge Social Pro** for maximum exposure."}
            </p>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>£5.00<span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ textAlign: 'left', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10b981" /> {t?.merchant?.toolkit?.social?.upgrade?.feature1 || "60 AI Campaigns/Month"}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10b981" /> {t?.merchant?.toolkit?.social?.upgrade?.feature2 || "AI Video Animation Unlocked"}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10b981" /> {t?.merchant?.toolkit?.social?.upgrade?.feature3 || "Enhanced Image Upscaling"}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10b981" /> {t?.merchant?.toolkit?.social?.upgrade?.feature4 || "Custom Platform Branding"}</li>
              </ul>
            </div>
            <button 
              onClick={handleUpgradeAccount}
              disabled={upgrading}
              style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'linear-gradient(135deg, #d4af37, #f59e0b)', color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: upgrading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {upgrading ? <Loader2 className="animate-spin" size={18} /> : null}
              {t?.merchant?.toolkit?.social?.upgrade?.cta || "Upgrade Now for £5.00"}
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t?.merchant?.toolkit?.social?.upgrade?.note || "Cancel anytime. High-trust professional AI tools."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
