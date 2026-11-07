import datetime
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings
from app.models.schemas import DigestResponse


class EmailService:
    def __init__(self, api_key: Optional[str] = None, from_email: Optional[str] = None):
        self.api_key = api_key or settings.RESEND_API_KEY
        self.from_email = from_email or settings.RESEND_FROM_EMAIL
        self.api_url = "https://api.resend.com/emails"

    @staticmethod
    def generate_digest_html(
        user_name: str, 
        matched_jobs: List[Dict[str, Any]], 
        app_url: str = "https://jobcurrent.app"
    ) -> str:
        today_str = datetime.datetime.now().strftime("%A, %b %d, %Y")

        cards_html = []
        for job in matched_jobs:
            stipend = job.get("stipend")
            sal_max = job.get("salary_max")
            
            if stipend:
                comp_str = f"₹{int(stipend):,}/mo"
            elif sal_max:
                comp_str = f"₹{sal_max / 100000:.1f} LPA"
            else:
                comp_str = "Competitive"

            score = job.get("match_score", job.get("matchScore", 90))
            elig = job.get("eligibility_status", job.get("eligibilityStatus", "Eligible")).capitalize()
            app_url_link = job.get("application_url", app_url)

            card = f"""
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">{job.get('company_name', 'Verified Employer')}</span>
                    <h3 style="margin: 4px 0 8px 0; font-size: 16px; font-weight: 700; color: #0f172a;">{job.get('title', 'Software Opportunity')}</h3>
                    <div style="margin-bottom: 12px;">
                      <span style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-right: 6px;">{job.get('work_mode', 'hybrid').capitalize()}</span>
                      <span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; margin-right: 6px;">{job.get('job_type', 'full-time').capitalize()}</span>
                      <span style="display: inline-block; background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;">{comp_str}</span>
                    </div>
                    <div style="font-size: 12px; color: #475569; margin-bottom: 12px;">
                      <strong>Match Score:</strong> <span style="color: #2563eb; font-weight: 700;">{score}%</span> • 
                      <strong>Eligibility:</strong> <span style="color: #059669; font-weight: 600;">{elig}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="{app_url_link}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 8px;">Apply on Official Portal &rarr;</a>
                  </td>
                </tr>
              </table>
            </div>
            """
            cards_html.append(card)

        cards_combined = "\n".join(cards_html)

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Your Daily Career Digest — JobCurrent</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
            <tr>
              <td style="padding-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">JobCurrent</h1>
                      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 600; color: #2563eb;">Stay Current. Stay Career-Ready.</p>
                    </td>
                    <td align="right" style="font-size: 12px; color: #64748b;">
                      {today_str}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0f172a;">Good morning, {user_name}!</h2>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569;">
                  We found <strong>{len(matched_jobs)} new opportunities</strong> matching your qualifications and career preferences today.
                </p>
              </td>
            </tr>

            <tr><td height="16"></td></tr>

            <tr>
              <td>
                {cards_combined}
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 16px 0 32px 0;">
                <a href="{app_url}/jobs" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">
                  View All Opportunities in Dashboard &rarr;
                </a>
              </td>
            </tr>

            <tr>
              <td style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                <p style="margin: 0 0 8px 0;">You are receiving this digest because daily notifications are enabled in your JobCurrent account.</p>
                <p style="margin: 0;">
                  <a href="{app_url}/dashboard/preferences" style="color: #64748b; text-decoration: underline;">Manage Digest Preferences</a> • 
                  <a href="{app_url}/dashboard/preferences" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
                </p>
                <p style="margin: 8px 0 0 0;">© {datetime.datetime.now().year} JobCurrent Technologies Inc.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """

    async def send_daily_digest(
        self, 
        recipient_email: str, 
        user_name: str, 
        matched_jobs: List[Dict[str, Any]], 
        app_url: str = "https://jobcurrent.app"
    ) -> DigestResponse:
        if not matched_jobs:
            return DigestResponse(
                success=True,
                recipient=recipient_email,
                jobs_count=0,
                error="No matching jobs found to dispatch"
            )

        html = self.generate_digest_html(user_name, matched_jobs, app_url)
        subject = f"JobCurrent Digest: {len(matched_jobs)} new roles matched to your profile"

        if not self.api_key or "placeholder" in self.api_key or self.api_key == "re_your_resend_api_key_here":
            return DigestResponse(
                success=True,
                recipient=recipient_email,
                jobs_count=len(matched_jobs),
                message_id=f"mock-py-msg-{int(datetime.datetime.now().timestamp())}",
                mocked=True
            )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    self.api_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "from": self.from_email,
                        "to": recipient_email,
                        "subject": subject,
                        "html": html
                    }
                )

                if resp.status_code in [200, 201]:
                    data = resp.json()
                    return DigestResponse(
                        success=True,
                        recipient=recipient_email,
                        jobs_count=len(matched_jobs),
                        message_id=data.get("id"),
                        mocked=False
                    )
                else:
                    return DigestResponse(
                        success=False,
                        recipient=recipient_email,
                        jobs_count=len(matched_jobs),
                        error=f"Resend error {resp.status_code}: {resp.text}"
                    )
        except Exception as e:
            return DigestResponse(
                success=False,
                recipient=recipient_email,
                jobs_count=len(matched_jobs),
                error=str(e)
            )
