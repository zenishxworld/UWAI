// University Data Utility — loads country-wise JSON data from local files
import fs from 'fs';
import path from 'path';

export interface University {
    rank: number;
    university_name: string;
    city: string;
    type: string;
    popular_english_programs: string[];
    min_cgpa: string;
    ielts_requirement: string;
    gre_required: string;
    annual_tuition_fee_inr: string;
    estimated_annual_living_cost_inr: string;
    program_duration_years: string;
    avg_starting_salary_inr: string;
    employment_rate: string;
    post_study_work_visa: string;
    visa_risk: string;
    website: string;
    source: string;
    // derived
    country: string;
    slug: string;
}

const COUNTRY_FILES: Record<string, string> = {
    canada: 'Canada_uni.txt',
    germany: 'Germany_uni.txt',
};

const DATA_DIR = path.join(process.cwd(), 'University_data');

let cache: Record<string, University[]> = {};

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function getAvailableCountries(): { code: string; name: string; flag: string; count: number }[] {
    return Object.keys(COUNTRY_FILES).map(code => {
        const unis = getUniversitiesByCountry(code);
        const names: Record<string, string> = { canada: 'Canada', germany: 'Germany' };
        const flags: Record<string, string> = { canada: '🇨🇦', germany: '🇩🇪' };
        return { code, name: names[code] || code, flag: flags[code] || '🌍', count: unis.length };
    });
}

export function getUniversitiesByCountry(country: string): University[] {
    const key = country.toLowerCase();
    if (cache[key]) return cache[key];

    const fileName = COUNTRY_FILES[key];
    if (!fileName) return [];

    try {
        const filePath = path.join(DATA_DIR, fileName);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw) as Omit<University, 'country' | 'slug'>[];
        const unis = data.map(u => ({
            ...u,
            country: key,
            slug: generateSlug(u.university_name),
        }));
        cache[key] = unis;
        return unis;
    } catch (err) {
        console.error(`Failed to load university data for ${country}:`, err);
        return [];
    }
}

export function getAllUniversities(): University[] {
    const all: University[] = [];
    for (const code of Object.keys(COUNTRY_FILES)) {
        all.push(...getUniversitiesByCountry(code));
    }
    return all;
}

export function getUniversityBySlug(country: string, slug: string): University | undefined {
    const unis = getUniversitiesByCountry(country);
    return unis.find(u => u.slug === slug);
}

export function searchUniversities(
    country: string | null,
    query: string,
    filters?: {
        maxTuition?: string;
        greRequired?: string;
        visaRisk?: string;
        programKeyword?: string;
    }
): University[] {
    let results = country ? getUniversitiesByCountry(country) : getAllUniversities();

    if (query) {
        const q = query.toLowerCase();
        results = results.filter(u =>
            u.university_name.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q) ||
            u.popular_english_programs.some(p => p.toLowerCase().includes(q))
        );
    }

    if (filters?.greRequired === 'no') {
        results = results.filter(u => u.gre_required.toLowerCase().startsWith('no'));
    }
    if (filters?.greRequired === 'yes') {
        results = results.filter(u => u.gre_required.toLowerCase().startsWith('yes'));
    }

    if (filters?.visaRisk) {
        results = results.filter(u => u.visa_risk.toLowerCase() === filters.visaRisk!.toLowerCase());
    }

    if (filters?.programKeyword) {
        const kw = filters.programKeyword.toLowerCase();
        results = results.filter(u =>
            u.popular_english_programs.some(p => p.toLowerCase().includes(kw))
        );
    }

    return results;
}
