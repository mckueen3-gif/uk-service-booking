'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export interface MaintenanceEvent {
  id: string;
  assetId: string;
  assetName: string;
  type: 'MOT' | 'SERVICE' | 'BOILER' | 'ROOF' | 'SAFETY';
  title: string;
  dueDate: Date;
  status: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
  description: string;
  category: 'Automotive' | 'Home';
}

export async function getMaintenanceTimeline() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Timeline Error: No session found.");
      return [];
    }

    const user = session.user as any;
    const userId = user.id;
    if (!userId) {
      console.log("Timeline Error: No user ID found in session.");
      return [];
    }

    // Safely check for Prisma models
    const vehicleModel = (prisma as any).vehicle || (prisma as any).Vehicle;
    const propertyModel = (prisma as any).property || (prisma as any).Property;

    if (!vehicleModel || !propertyModel) {
      console.error("Timeline Error: Prisma models 'vehicle' or 'property' not found. Available keys:", Object.keys(prisma));
      return [];
    }

    const [vehicles, properties] = await Promise.all([
      vehicleModel.findMany({ where: { userId } }),
      propertyModel.findMany({ where: { userId } })
    ]);

    const events: MaintenanceEvent[] = [];
    const now = new Date();
    const dueSoonMillis = 30 * 24 * 60 * 60 * 1000; // 30 days

    // Process Vehicles
    vehicles.forEach((v: any) => {
      const assetName = `${v.make} ${v.model} (${v.reg || v.year})`;

      // MOT Check
      if (v.motDate) {
        const motDue = new Date(v.motDate);
        if (isNaN(motDue.getTime())) return;
        
        // If MOT date is in the past, assume next one is 1 year later
        if (motDue.getTime() < now.getTime()) {
          motDue.setFullYear(motDue.getFullYear() + 1);
        }
        
        events.push({
          id: `mot-${v.id}`,
          assetId: v.id,
          assetName,
          type: 'MOT',
          title: 'MOT Renewal',
          dueDate: motDue,
          status: getStatus(motDue, now, dueSoonMillis),
          description: 'Mandatory UK roadworthiness test.',
          category: 'Automotive'
        });
      }

      // Service Check
      if (v.lastService) {
        const serviceDue = new Date(v.lastService);
        if (isNaN(serviceDue.getTime())) return;
        
        serviceDue.setFullYear(serviceDue.getFullYear() + 1);
        
        events.push({
          id: `service-${v.id}`,
          assetId: v.id,
          assetName,
          type: 'SERVICE',
          title: 'Annual Full Service',
          dueDate: serviceDue,
          status: getStatus(serviceDue, now, dueSoonMillis),
          description: 'Ensure engine longevity and safety.',
          category: 'Automotive'
        });
      }
    });

    // Process Properties
    properties.forEach((p: any) => {
      const assetName = p.address;

      // Boiler Logic
      if (p.boilerAge !== undefined && p.boilerAge !== null) {
        // Recommend annual service based on first record creation if no last service date
        const boilerDue = new Date(p.createdAt || now);
        boilerDue.setFullYear(boilerDue.getFullYear() + 1);
        
        events.push({
          id: `boiler-${p.id}`,
          assetId: p.id,
          assetName,
          type: 'BOILER',
          title: 'Boiler Safety Check',
          dueDate: boilerDue,
          status: getStatus(boilerDue, now, dueSoonMillis),
          description: 'Gas Safe registered inspection recommended annually.',
          category: 'Home'
        });
      }
    });

    return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  } catch (err) {
    console.error("Critical Failure in getMaintenanceTimeline:", err);
    return [];
  }
}

function getStatus(dueDate: Date, now: Date, dueSoonMillis: number): MaintenanceEvent['status'] {
  const diff = dueDate.getTime() - now.getTime();
  if (diff < 0) return 'OVERDUE';
  if (diff < dueSoonMillis) return 'DUE_SOON';
  return 'UPCOMING';
}
