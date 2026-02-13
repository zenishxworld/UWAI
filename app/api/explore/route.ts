import { NextResponse } from 'next/server';
import {
    getAvailableCountries,
    searchUniversities,
    getUniversityBySlug,
} from '@/lib/universityData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');
        const query = searchParams.get('q') || '';
        const slug = searchParams.get('slug');
        const greRequired = searchParams.get('gre');
        const visaRisk = searchParams.get('visa');
        const programKeyword = searchParams.get('program');

        // Single university lookup
        if (country && slug) {
            const uni = getUniversityBySlug(country, slug);
            if (!uni) {
                return NextResponse.json({ error: 'University not found' }, { status: 404 });
            }
            return NextResponse.json({ university: uni });
        }

        // List / search
        const universities = searchUniversities(country, query, {
            greRequired: greRequired || undefined,
            visaRisk: visaRisk || undefined,
            programKeyword: programKeyword || undefined,
        });

        const countries = getAvailableCountries();

        return NextResponse.json({
            universities,
            countries,
            total: universities.length,
        });
    } catch (error: any) {
        console.error('Explore universities error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
