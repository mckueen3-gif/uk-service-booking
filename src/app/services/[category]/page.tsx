"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/components/LanguageContext';
import CategoryLanding from '@/components/services/CategoryLanding';
import { 
  Droplets, Zap, Monitor, Flame, Smartphone, 
  Hammer, Sofa, Square, Layers, Palette, Wrench,
  Utensils, Home, Map, Grid, Leaf, PenTool,
  DollarSign, FileText, FileCheck, Users, Cloud, BarChart,
  FileEdit, Plane, Building, Gavel, Scale, ShieldAlert,
  SprayCan, Key, Wind, Sun, Briefcase, Activity,
  Settings, Disc, ClipboardCheck, Snowflake, Truck, Factory, Network, Fan,
  HelpCircle, GraduationCap, Languages, Microscope, Award, Heart, Calculator
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  // Education
  academic: <GraduationCap size={28} />,
  language: <Languages size={28} />,
  stem: <Microscope size={28} />,
  arts: <Palette size={28} />,
  finance: <Calculator size={28} />,
  career: <Briefcase size={28} />,
  junior: <Users size={28} />,
  masterclass: <Award size={28} />,
  sen: <Heart size={28} />,
  // Plumbing
  pipe: <Droplets size={28} />,
  wiring: <Zap size={28} />,
  appliance: <Monitor size={28} />,
  boiler: <Flame size={28} />,
  switch: <Zap size={28} />, // Power icon
  smart: <Smartphone size={28} />,
  // Repairs
  furniture: <Sofa size={28} />,
  structural: <Hammer size={28} />,
  wall: <Square size={28} />,
  mounting: <Layers size={28} />,
  coating: <Palette size={28} />,
  tactics: <Wrench size={28} />,
  // Renovation
  culinary: <Utensils size={28} />,
  expansion: <Home size={28} />,
  layout: <Map size={28} />,
  floor: <Grid size={28} />,
  landscape: <Leaf size={28} />,
  design: <PenTool size={28} />,
  // Accounting
  income: <DollarSign size={28} />,
  accounts: <FileText size={28} />,
  tax: <FileCheck size={28} />,
  payroll: <Users size={28} />,
  xero: <Cloud size={28} />,
  fiscal: <BarChart size={28} />,
  // Legal
  drafting: <FileEdit size={28} />,
  visa: <Plane size={28} />,
  property: <Building size={28} />,
  arbitration: <Gavel size={28} />,
  law: <Scale size={28} />,
  notary: <ShieldAlert size={28} />,
  // Cleaning
  hygiene: <SprayCan size={28} />,
  tenancy: <Key size={28} />,
  textile: <Wind size={28} />,
  aperture: <Sun size={28} />,
  office: <Briefcase size={28} />,
  bio: <Activity size={28} />,
  // Auto
  engine: <Settings size={28} />,
  brakes: <Disc size={28} />,
  mot: <ClipboardCheck size={28} />,
  ac: <Snowflake size={28} />,
  bodywork: <Wrench size={28} />,
  battery: <Zap size={28} />,
  // Commercial
  fitting: <Grid size={28} />,
  relocation: <Truck size={28} />,
  industrial: <Factory size={28} />,
  fire: <ShieldAlert size={28} />,
  mesh: <Network size={28} />,
  hvac: <Fan size={28} />
};

const colorMap: Record<string, string> = {
  plumbing: '#3b82f6',
  repairs: '#10b981',
  renovation: '#f59e0b',
  accounting: '#6366f1',
  legal: '#8b5cf6',
  cleaning: '#ec4899',
  car: '#ef4444',
  commercial: '#14b8a6',
  education: '#6366f1'
};

export default function DynamicCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { t } = useTranslation();

  // Handle education separately if needed, though we want it unified
  if (category === 'education') {
    // Current education data is in education_sec, let's map it
    const eduSub = Object.keys(t.education_sec.categories.items).map(key => ({
      id: key,
      title: t.education_sec.categories.items[key].title,
      desc: t.education_sec.categories.items[key].desc,
      icon: iconMap[key] || <GraduationCap size={28} />,
      color: colorMap.education
    }));

    return (
      <CategoryLanding 
        categoryKey="education"
        categoryName={t.home.categories.education}
        heroBadge={t.education_sec.hero.badge}
        heroTitle1={t.education_sec.hero.title1}
        heroTitle2={t.education_sec.hero.title2}
        heroSubtitle={t.education_sec.hero.subtitle}
        searchPlaceholder={t.education_sec.hero.searchPlaceholder}
        searchBtn={t.education_sec.hero.searchBtn}
        subCategories={eduSub}
        apiEndpoint="/api/education/tutors"
      />
    );
  }

  const landingData = t.landing_pages[category];

  if (!landingData) {
    return (
      <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
        <HelpCircle size={64} color="var(--text-muted)" style={{ marginBottom: '2rem' }} />
        <h1>Category Node Not Found</h1>
        <p>The requested service protocol is not persistent in our registry.</p>
        <button onClick={() => window.history.back()} className="btn btn-primary" style={{ marginTop: '2rem' }}>Return to Safety</button>
      </div>
    );
  }

  const subCategories = Object.keys(landingData.sub_categories).map(key => ({
    id: key,
    title: landingData.sub_categories[key].title,
    desc: landingData.sub_categories[key].desc,
    icon: iconMap[key] || <Wrench size={28} />,
    color: colorMap[category] || '#6366f1'
  }));

  return (
    <CategoryLanding 
      categoryKey={category}
      categoryName={t.home.categories[category] || category}
      heroBadge={landingData.hero.badge}
      heroTitle1={landingData.hero.title1}
      heroTitle2={landingData.hero.title2}
      heroSubtitle={landingData.hero.subtitle}
      searchPlaceholder={landingData.hero.searchPlaceholder}
      searchBtn={landingData.hero.searchBtn}
      subCategories={subCategories}
    />
  );
}
