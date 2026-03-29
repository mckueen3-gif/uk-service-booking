import { redirect } from "next/navigation";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(params).toString();
  
  // Map 'city' from homepage to 'location' expected by results page
  if (params.city && !params.location) {
    const newParams = new URLSearchParams(params);
    newParams.set('location', params.city);
    newParams.delete('city');
    redirect(`/services/results?${newParams.toString()}`);
  }

  redirect(`/services/results?${queryString}`);
}
