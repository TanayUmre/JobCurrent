import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) return null;
  if (currency === 'INR') {
    if (amount >= 100000) {
      const lpa = (amount / 100000).toFixed(1).replace(/\.0$/, '');
      return `₹${lpa} LPA`;
    }
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min, max, stipend, currency = 'INR', jobType = 'full-time') {
  if (jobType === 'internship' && stipend) {
    return `${formatCurrency(stipend, currency)}/month`;
  }
  if (min && max) {
    return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
  }
  if (min) {
    return `From ${formatCurrency(min, currency)}`;
  }
  if (max) {
    return `Up to ${formatCurrency(max, currency)}`;
  }
  return 'Not Disclosed';
}

export function timeAgo(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDeadline(dateString) {
  if (!dateString) return { text: 'Rolling basis', isUrgent: false, isExpired: false };
  const deadline = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Applications closed', isUrgent: false, isExpired: true };
  if (diffDays === 0) return { text: 'Closes today', isUrgent: true, isExpired: false };
  if (diffDays === 1) return { text: 'Closes tomorrow', isUrgent: true, isExpired: false };
  if (diffDays <= 5) return { text: `Closes in ${diffDays} days`, isUrgent: true, isExpired: false };
  return { 
    text: `Apply by ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, 
    isUrgent: false, 
    isExpired: false 
  };
}

/**
 * Calculates deterministic eligibility breakdown
 */
export function checkEligibility(job, profile) {
  if (!profile) return { status: 'unknown', reasons: ['Complete your profile to verify eligibility'] };

  let isEligible = true;
  let hasUnknown = false;
  const reasons = [];

  // 1. CGPA Check
  if (job.minimum_cgpa) {
    if (!profile.cgpa) {
      hasUnknown = true;
      reasons.push({ criteria: 'CGPA', satisfied: 'unknown', message: `Job requires min ${job.minimum_cgpa} CGPA (Your CGPA not specified)` });
    } else if (Number(profile.cgpa) >= Number(job.minimum_cgpa)) {
      reasons.push({ criteria: 'CGPA', satisfied: true, message: `Your CGPA (${profile.cgpa}) meets minimum (${job.minimum_cgpa})` });
    } else {
      isEligible = false;
      reasons.push({ criteria: 'CGPA', satisfied: false, message: `CGPA requirement not met (${profile.cgpa} < ${job.minimum_cgpa})` });
    }
  }

  // 2. Graduation Year Check
  if (job.eligible_graduation_years && job.eligible_graduation_years.length > 0) {
    if (!profile.graduation_year) {
      hasUnknown = true;
      reasons.push({ criteria: 'Graduation Year', satisfied: 'unknown', message: `Eligible batches: ${job.eligible_graduation_years.join(', ')}` });
    } else if (job.eligible_graduation_years.includes(Number(profile.graduation_year))) {
      reasons.push({ criteria: 'Graduation Year', satisfied: true, message: `Batch ${profile.graduation_year} is eligible` });
    } else {
      isEligible = false;
      reasons.push({ criteria: 'Graduation Year', satisfied: false, message: `Only ${job.eligible_graduation_years.join(', ')} batches are eligible` });
    }
  }

  // 3. Branch / Department Check
  if (job.eligible_branches && job.eligible_branches.length > 0) {
    if (!profile.branch) {
      hasUnknown = true;
      reasons.push({ criteria: 'Branch', satisfied: 'unknown', message: `Specific branches required` });
    } else {
      const branchLower = profile.branch.toLowerCase();
      const match = job.eligible_branches.some(b => 
        branchLower.includes(b.toLowerCase()) || b.toLowerCase().includes(branchLower) || b.toLowerCase() === 'all'
      );
      if (match) {
        reasons.push({ criteria: 'Branch', satisfied: true, message: `${profile.branch} is eligible` });
      } else {
        isEligible = false;
        reasons.push({ criteria: 'Branch', satisfied: false, message: `Preferred branches: ${job.eligible_branches.join(', ')}` });
      }
    }
  }

  if (!isEligible) return { status: 'not_eligible', reasons };
  if (hasUnknown) return { status: 'unknown', reasons };
  return { status: 'eligible', reasons };
}

/**
 * Calculates a match score between 0 and 100
 */
export function calculateMatchScore(job, profile, preferences) {
  if (!profile && !preferences) return 0;

  let score = 0;
  const userSkills = (profile?.skills || preferences?.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.required_skills || []).map(s => s.toLowerCase());

  // Skills overlap (up to 50 points)
  if (jobSkills.length > 0) {
    const matchedSkills = jobSkills.filter(js => userSkills.some(us => us.includes(js) || js.includes(us)));
    const skillScore = Math.round((matchedSkills.length / jobSkills.length) * 50);
    score += skillScore;
  } else {
    score += 35; // Default if no specific skills listed
  }

  // Role preference (up to 20 points)
  const interestedRoles = (preferences?.interested_roles || []).map(r => r.toLowerCase());
  if (interestedRoles.length > 0 && job.title) {
    const titleMatch = interestedRoles.some(role => job.title.toLowerCase().includes(role));
    if (titleMatch) score += 20;
  } else {
    score += 10;
  }

  // Work Mode preference (up to 15 points)
  const preferredModes = preferences?.work_modes || [];
  if (preferredModes.length > 0 && job.work_mode) {
    if (preferredModes.includes(job.work_mode.toLowerCase())) score += 15;
  } else {
    score += 10;
  }

  // Eligibility bonus (up to 15 points)
  const eligibility = checkEligibility(job, profile);
  if (eligibility.status === 'eligible') score += 15;
  else if (eligibility.status === 'unknown') score += 8;

  return Math.min(Math.max(score, 10), 98);
}
