"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function verifyLicenseImage(base64Image: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  if (!session || !user || user.role !== "MERCHANT") {
    return { success: false, error: "Unauthorized access. Only Professionals can verify documents." };
  }

  try {
    // 🚧 Development / Testing Mode: "Mock AI Engine Simulator" 
    // Since local networks in HK are blocked by Google AI APIs (404/403 errors),
    // we use a simulated delay so you can bypass this and test the Stripe Dashboard.
    
    // --- [REAL AI PROMPT FOR PRODUCTION DEPLOYMENT] ---
    // const prompt = `You are a strict specialized AI verifying UK professional trade licenses.
    // Analyze this uploaded image. It MUST be a valid United Kingdom identity document 
    // (e.g., UK Driver's License, UK Passport) or a UK professional trade certificate 
    // (Gas Safe Register, NICEIC, NVQ). If it is from Hong Kong or any other country, 
    // you MUST reject it. Return a valid JSON object exactly with keys: 
    // 'isValid' (boolean), 'documentType' (string), and 'reason' (string explaining why it passed or failed).`;
    // --------------------------------------------------

    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulate AI Vision analysis output (Pretending it's a valid UK Doc for testing purposes)
    const result = {
      isValid: true,
      documentType: "UK Driver's License (Simulated)",
      reason: "The uploaded image contains clear identifying information matching United Kingdom standards and valid security patterns."
    };
    
    // Update their Merchant Database record
    if (result.isValid === true) {
      await prisma.merchant.upsert({
        where: { userId: user.id },
        update: {
          isVerified: true,
          licenseUrl: "mock_ai_verified",
        },
        create: {
          userId: user.id,
          companyName: user.name || "Independent Professional",
          city: "London", // Fallback Default
          isVerified: true,
          licenseUrl: "mock_ai_verified",
        }
      });
    }

    return { success: true, data: result };

  } catch (error: any) {
    console.error("Verification Error:", error);
    return { success: false, error: "Simulation Engine encountered an error: " + error.message };
  }
}
