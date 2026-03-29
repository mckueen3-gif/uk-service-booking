"use server";

export async function lookupVehicle(vrm: string) {
  console.log(`[VehicleLookup] Request for VRM: "${vrm}"`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!vrm) return { success: false, error: "Please enter a registration number." };

  const cleanVrm = vrm.replace(/[^A-Z0-9]/g, '').toUpperCase();
  console.log(`[VehicleLookup] Cleaned VRM: "${cleanVrm}"`);

  // Mock data mapping
  const mockData: Record<string, { make: string; model: string; year: string; engine: string }> = {
    "AB12CDE": { make: "Toyota", model: "Corolla", year: "2021", engine: "1.8 Petrol" },
    "WD19XTY": { make: "Tesla", model: "Model 3", year: "2019", engine: "Electric" },
    "BK22ZLP": { make: "BMW", model: "3 Series", year: "2022", engine: "2.0 Diesel" },
    "AA11AAA": { make: "Ford", model: "Fiesta", year: "2015", engine: "1.0 EcoBoost" },
    "YT70KSM": { make: "Audi", model: "A3", year: "2020", engine: "1.4 TFSI" },
  };

  if (mockData[cleanVrm]) {
    console.log(`[VehicleLookup] Found exact match:`, mockData[cleanVrm]);
    return { success: true, data: mockData[cleanVrm] };
  }

  // Fallback for demo purposes if not found but looks valid
  if (cleanVrm.length >= 2) {
      console.log(`[VehicleLookup] No exact match, using fallback for: ${cleanVrm}`);
      return { 
          success: true, 
          data: { make: "Volkswagen", model: "Golf", year: "2020", engine: "1.5 TSI" } 
      };
  }

  console.log(`[VehicleLookup] No match found for: ${cleanVrm}`);
  return { success: false, error: "Vehicle not found. Please check the plate or enter manually." };
}
