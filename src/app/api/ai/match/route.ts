import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { studentQuery, postcode } = await req.json();

    // In a real scenario, this would call OpenAI or Anthropic to parse the studentQuery and match against the DB.
    // Demo implementation randomly scores some tutors based on input keyword length.
    const mockTutors = [
      { id: "1", name: "Dr. Emily Smith", matchScore: 98, reason: "Perfect match for GCSE Maths in your area." },
      { id: "2", name: "Sarah Connor", matchScore: 85, reason: "Great experience with similar students." }
    ];

    return NextResponse.json({
      success: true,
      matches: mockTutors,
      analysis: `AI determined that you are looking for ${studentQuery} near ${postcode}.`
    });

  } catch (error: any) {
    console.error("AI Match Error:", error);
    return NextResponse.json({ error: "Failed to perform AI match" }, { status: 500 });
  }
}
