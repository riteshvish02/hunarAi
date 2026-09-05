import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { peopleSearchService } from '../services/peopleSearch.service';
import { hunarService } from '../services/hunar.service';

export class SourcingController {
  /**
   * POST /api/sourcing/parse-jd
   * Parse Job Description using Gemini 2.5 Flash LLM
   */
  async parseJobDescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { job_description, target_role } = req.body;

      if (!job_description || typeof job_description !== 'string' || job_description.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'job_description string is required in request body',
        });
        return;
      }

      const parsedCriteria = await geminiService.parseJobDescription(job_description, target_role);

      res.status(200).json({
        success: true,
        data: parsedCriteria,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/sourcing/search
   * Search matching candidates across People Data Labs / Apollo schema
   */
  async searchCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { required_skills, role_title, min_experience_years, query } = req.body;

      const results = await peopleSearchService.searchCandidates({
        required_skills,
        role_title,
        min_experience_years,
        query,
      });

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/sourcing/reachout
   * Trigger outbound Voice AI screening call to candidate
   */
  async reachoutCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { candidate_id, agent_id, role_title, mobile_number, custom_data = {} } = req.body;

      if (!candidate_id || !agent_id) {
        res.status(400).json({
          success: false,
          error: 'candidate_id and agent_id are required fields',
        });
        return;
      }

      const candidate = await peopleSearchService.getCandidateById(candidate_id);
      if (!candidate) {
        res.status(404).json({
          success: false,
          error: `Candidate not found with ID ${candidate_id}`,
        });
        return;
      }

      const targetRole = role_title || candidate.currentTitle;
      let formattedMobile = mobile_number && mobile_number.trim() ? mobile_number.trim() : candidate.mobileNumber;
      if (!formattedMobile.startsWith('+')) {
        formattedMobile = formattedMobile.length === 10 ? `+91${formattedMobile}` : `+${formattedMobile}`;
      }

      // Format all custom_data values as strings to satisfy Hunar Voice API validation
      const sanitizedCustomData: Record<string, string> = {
        candidate_name: String(candidate.fullName),
        company_name: 'Hunar.AI Hiring',
        candidate_memory: `${candidate.fullName} is an experienced ${candidate.currentTitle} with ${candidate.experienceYears} years experience in ${candidate.skills.slice(0, 5).join(', ')}. Fit reason: ${candidate.matchReason}`,
        role_title: String(targetRole),
        job_title: String(targetRole),
        key_requirements: candidate.skills.slice(0, 5).join(', '),
        candidate_current_company: String(candidate.currentCompany),
        experience_years: String(candidate.experienceYears),
        current_company: String(candidate.currentCompany),
        location: String(candidate.location),
      };

      if (custom_data && typeof custom_data === 'object') {
        for (const [k, v] of Object.entries(custom_data)) {
          if (v !== undefined && v !== null) {
            sanitizedCustomData[k] = String(v);
          }
        }
      }

      const callResult = await hunarService.triggerCall({
        agent_id,
        callee_name: candidate.fullName,
        mobile_number: formattedMobile,
        custom_data: sanitizedCustomData,
        request_id: `sourcing-outreach-${Date.now()}`,
      });

      res.status(201).json({
        success: true,
        message: `Voice AI outreach initiated to ${candidate.fullName}`,
        candidate: {
          id: candidate.id,
          name: candidate.fullName,
          title: candidate.currentTitle,
          company: candidate.currentCompany,
        },
        call: callResult,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const sourcingController = new SourcingController();
