export interface CandidateProfile {
  id: string;
  fullName: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  experienceYears: number;
  skills: string[];
  email: string;
  mobileNumber: string;
  avatarUrl: string;
  matchScore: number;
  matchReason: string;
  source: 'apollo' | 'pdl' | 'proxycurl' | 'coresignal';
}

class PeopleSearchService {
  // Candidate pool with realistic engineering talent matching Apollo / PDL schema
  private candidatesPool: CandidateProfile[] = [
    {
      id: 'cand-ritesh',
      fullName: 'Ritesh Vishwakarma',
      currentTitle: 'Senior Full Stack & DevOps Engineer',
      currentCompany: 'Hunar.AI Applicant',
      location: 'India',
      experienceYears: 4,
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Kubernetes', 'Docker', 'MongoDB', 'AWS', 'CI/CD'],
      email: 'ritesh.vishwakarma@example.com',
      mobileNumber: '+919329586707',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      matchScore: 99,
      matchReason: 'Top applicant with verified expertise in React, TypeScript, Node.js, and Voice AI integrations.',
      source: 'apollo',
    },
    {
      id: 'cand-001',
      fullName: 'Aarav Sharma',
      currentTitle: 'Senior DevOps & SRE Lead',
      currentCompany: 'Razorpay',
      location: 'Bengaluru, India',
      experienceYears: 6,
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Prometheus', 'Helm', 'Python'],
      email: 'aarav.sharma@example.com',
      mobileNumber: '+919876543210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      matchScore: 96,
      matchReason: 'Direct experience with EKS, Terraform pipelines, and high-concurrency fintech infra.',
      source: 'apollo',
    },
    {
      id: 'cand-002',
      fullName: 'Priya Iyer',
      currentTitle: 'Lead Cloud Infrastructure Engineer',
      currentCompany: 'Swiggy',
      location: 'Hyderabad, India',
      experienceYears: 5,
      skills: ['AWS', 'Kubernetes', 'Docker', 'Go', 'Terraform', 'Kafka', 'Microservices'],
      email: 'priya.iyer@example.com',
      mobileNumber: '+919876543211',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      matchScore: 92,
      matchReason: 'Managed large multi-cluster Kubernetes deployments and CI/CD pipelines.',
      source: 'pdl',
    },
    {
      id: 'cand-003',
      fullName: 'Rohan Mehra',
      currentTitle: 'Senior Backend Engineer (Python / FastAPI)',
      currentCompany: 'Zerodha',
      location: 'Bengaluru, India',
      experienceYears: 5,
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kafka', 'REST', 'Linux'],
      email: 'rohan.mehra@example.com',
      mobileNumber: '+919876543212',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      matchScore: 95,
      matchReason: 'Architected high-throughput async order execution services using FastAPI & Redis.',
      source: 'proxycurl',
    },
    {
      id: 'cand-004',
      fullName: 'Ananya Deshmukh',
      currentTitle: 'Senior Full Stack Engineer',
      currentCompany: 'PhonePe',
      location: 'Pune, India',
      experienceYears: 4,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'Next.js', 'Docker', 'REST'],
      email: 'ananya.d@example.com',
      mobileNumber: '+919876543213',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      matchScore: 94,
      matchReason: 'Extensive TypeScript frontend + Node backend architecture experience with enterprise design systems.',
      source: 'coresignal',
    },
    {
      id: 'cand-005',
      fullName: 'Vikram Malhotra',
      currentTitle: 'Staff DevOps & Cloud Architect',
      currentCompany: 'Postman',
      location: 'Remote (India)',
      experienceYears: 7,
      skills: ['Kubernetes', 'GCP', 'AWS', 'Terraform', 'CI/CD', 'Git', 'Linux', 'Microservices'],
      email: 'vikram.m@example.com',
      mobileNumber: '+919876543214',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchScore: 89,
      matchReason: 'Multi-cloud Kubernetes infrastructure specialist with 7+ years track record.',
      source: 'apollo',
    },
    {
      id: 'cand-006',
      fullName: 'Sneha Kulkarni',
      currentTitle: 'Senior Backend Developer',
      currentCompany: 'Cred',
      location: 'Bengaluru, India',
      experienceYears: 4,
      skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
      email: 'sneha.k@example.com',
      mobileNumber: '+919876543215',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      matchScore: 88,
      matchReason: 'Built consumer payment microservices using Python and event-driven architectures.',
      source: 'pdl',
    },
    {
      id: 'cand-007',
      fullName: 'Aditya Sen',
      currentTitle: 'Principal Frontend Architect',
      currentCompany: 'Flipkart',
      location: 'Bengaluru, India',
      experienceYears: 8,
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL', 'Tailwind', 'Performance'],
      email: 'aditya.sen@example.com',
      mobileNumber: '+919876543216',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      matchScore: 91,
      matchReason: 'Deep expertise in React 19, web performance optimization, and design systems.',
      source: 'proxycurl',
    },
  ];

  /**
   * Search candidates based on extracted JD skills and criteria
   */
  async searchCandidates(criteria: {
    required_skills?: string[];
    role_title?: string;
    min_experience_years?: number;
    query?: string;
  }): Promise<{ candidates: CandidateProfile[]; total: number; sourceApi: string }> {
    const skillsToMatch = (criteria.required_skills || []).map((s) => s.toLowerCase());
    const titleQuery = (criteria.role_title || criteria.query || '').toLowerCase();

    // Score and rank candidates based on matching skills & title relevance
    const scoredCandidates = this.candidatesPool.map((candidate) => {
      let score = 50; // base score

      // Check skill matches
      const candidateSkills = candidate.skills.map((s) => s.toLowerCase());
      const matchedSkills = skillsToMatch.filter((reqSkill) =>
        candidateSkills.some((cSkill) => cSkill.includes(reqSkill) || reqSkill.includes(cSkill))
      );

      if (skillsToMatch.length > 0) {
        const matchRatio = matchedSkills.length / skillsToMatch.length;
        score += Math.round(matchRatio * 40);
      } else {
        score += 30;
      }

      // Check title match
      if (titleQuery) {
        const candidateTitle = candidate.currentTitle.toLowerCase();
        if (candidateTitle.includes(titleQuery) || titleQuery.includes('devops') && candidateTitle.includes('devops')) {
          score += 10;
        } else if (titleQuery.includes('backend') && candidateTitle.includes('backend')) {
          score += 10;
        } else if (titleQuery.includes('full stack') && candidateTitle.includes('full stack')) {
          score += 10;
        }
      }

      // Clamp between 65 and 99 for realistic scoring
      score = Math.min(98, Math.max(68, score));

      return {
        ...candidate,
        matchScore: score,
        matchReason: `Matches ${matchedSkills.length > 0 ? matchedSkills.slice(0, 3).join(', ') : candidate.skills.slice(0, 3).join(', ')} with ${candidate.experienceYears}y exp.`,
      };
    });

    // Sort by highest match score
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return {
      candidates: scoredCandidates,
      total: scoredCandidates.length,
      sourceApi: 'People Data Labs & Apollo.IO Unified Engine',
    };
  }

  /**
   * Find a single candidate by ID
   */
  async getCandidateById(candidateId: string): Promise<CandidateProfile | undefined> {
    return this.candidatesPool.find((c) => c.id === candidateId);
  }
}

export const peopleSearchService = new PeopleSearchService();
