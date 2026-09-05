import axios from 'axios';
import { ENV } from '../config/env';

export interface ParsedJobDescription {
  role_title: string;
  seniority: string;
  min_experience_years: number;
  required_skills: string[];
  preferred_skills: string[];
  key_responsibilities: string[];
  summary: string;
  sourcing_keywords: string[];
  extracted_via: 'gemini' | 'rule_engine';
}

class GeminiService {
  /**
   * Parse Job Description using Gemini 2.5 Flash with structured JSON output
   */
  async parseJobDescription(jobDescription: string, fallbackTitle?: string): Promise<ParsedJobDescription> {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description text cannot be empty');
    }

    // Try Gemini if API key is configured
    if (ENV.GEMINI_API_KEY) {
      try {
        console.log('[GeminiService] Calling Gemini 2.5 Flash for structured JD extraction...');
        const prompt = `You are an expert technical talent recruiter and NLP analyzer.
Analyze the following Job Description and extract structured sourcing criteria into strict JSON format with no markdown quotes.

Required JSON Structure:
{
  "role_title": "extracted standard job title",
  "seniority": "Junior / Mid-Level / Senior / Lead / Principal",
  "min_experience_years": number (e.g. 4),
  "required_skills": ["Skill1", "Skill2", ...],
  "preferred_skills": ["Skill1", "Skill2", ...],
  "key_responsibilities": ["Resp1", "Resp2", ...],
  "summary": "1-2 sentence concise pitch for a Voice AI screening agent to tell the candidate",
  "sourcing_keywords": ["keyword1", "keyword2", "keyword3"]
}

Job Description:
"""
${jobDescription}
"""
${fallbackTitle ? `Target Title Hint: ${fallbackTitle}` : ''}
`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
          }
        );

        const candidates = response.data?.candidates;
        if (candidates && candidates.length > 0) {
          const rawText = candidates[0].content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(rawText);

          return {
            role_title: parsed.role_title || fallbackTitle || 'Software Engineer',
            seniority: parsed.seniority || 'Mid-Senior',
            min_experience_years: typeof parsed.min_experience_years === 'number' ? parsed.min_experience_years : 3,
            required_skills: Array.isArray(parsed.required_skills) ? parsed.required_skills : [],
            preferred_skills: Array.isArray(parsed.preferred_skills) ? parsed.preferred_skills : [],
            key_responsibilities: Array.isArray(parsed.key_responsibilities) ? parsed.key_responsibilities : [],
            summary: parsed.summary || 'Technical role screening',
            sourcing_keywords: Array.isArray(parsed.sourcing_keywords) ? parsed.sourcing_keywords : [],
            extracted_via: 'gemini',
          };
        }
      } catch (err: any) {
        console.warn('[GeminiService] Gemini API call failed, falling back to rule engine:', err.response?.data?.error?.message || err.message);
      }
    } else {
      console.log('[GeminiService] No GEMINI_API_KEY configured. Running rule-based JD extractor.');
    }

    // High-performance NLP rule-based fallback
    return this.fallbackExtract(jobDescription, fallbackTitle);
  }

  /**
   * Rule-based extraction fallback for resilience
   */
  private fallbackExtract(text: string, titleHint?: string): ParsedJobDescription {
    const commonSkills = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'FastAPI', 'Django',
      'Go', 'Golang', 'Java', 'Spring Boot', 'Kubernetes', 'Docker', 'AWS', 'GCP',
      'Azure', 'Terraform', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST',
      'Kafka', 'CI/CD', 'Linux', 'Microservices', 'Git', 'Next.js', 'Tailwind'
    ];

    const detectedSkills = commonSkills.filter((skill) =>
      new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(text)
    );

    // Extract experience number if present (e.g. "4+ years", "5 years")
    const expMatch = text.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?(?:years?|yrs?)/i);
    const expYears = expMatch ? parseInt(expMatch[1], 10) : 4;

    // Determine seniority
    let seniority = 'Mid-Senior';
    if (/junior|fresher|entry/i.test(text)) seniority = 'Junior';
    else if (/lead|staff|principal|director/i.test(text)) seniority = 'Lead / Principal';
    else if (/senior|sr\./i.test(text) || expYears >= 5) seniority = 'Senior';

    const roleTitle = titleHint || (text.split('\n')[0] || 'Software Engineer').slice(0, 40).trim();

    return {
      role_title: roleTitle,
      seniority,
      min_experience_years: expYears,
      required_skills: detectedSkills.length > 0 ? detectedSkills.slice(0, 6) : ['JavaScript', 'TypeScript', 'Node.js'],
      preferred_skills: detectedSkills.slice(6, 10),
      key_responsibilities: [
        'Develop and maintain high-performance scalable systems',
        'Collaborate with cross-functional product & engineering teams',
        'Participate in architecture reviews and code quality standards',
      ],
      summary: `Hiring for ${roleTitle} with strong expertise in ${detectedSkills.slice(0, 3).join(', ') || 'modern software engineering'}.`,
      sourcing_keywords: detectedSkills.map((s) => s.toLowerCase()),
      extracted_via: 'rule_engine',
    };
  }
}

export const geminiService = new GeminiService();
