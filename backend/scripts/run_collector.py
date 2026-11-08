import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from app.connectors import get_active_connectors
from app.services.normalizer import NormalizerService


async def main():
    print("==========================================================")
    print("JobCurrent — FastAPI Python Multi-Source Job Collector")
    print("==========================================================\n")

    connectors = get_active_connectors()
    all_jobs = []

    for c in connectors:
        print(f"[Collector] Ingesting from {c.source_name}...")
        res = await c.execute()
        print(f"  -> Found: {res['jobs_found']}, Normalized: {res['jobs_normalized']}")
        all_jobs.extend(res["jobs"])

    # Normalization & Deduplication
    processed = [NormalizerService.process_job(j) for j in all_jobs]
    unique, duplicates = NormalizerService.filter_duplicates(processed)

    print(f"\n[Summary] Total Ingested: {len(all_jobs)}")
    print(f"[Summary] Unique Jobs: {len(unique)}")
    print(f"[Summary] Duplicates Merged: {len(duplicates)}")

    # Database Upsert if Supabase Credentials Configured
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            client = create_client(supabase_url, supabase_key)
            print("\n[Database] Syncing jobs with Supabase PostgreSQL...")

            # Clean and prepare payloads for Supabase schema
            records = []
            for j in unique:
                records.append({
                    "title": j.get("title"),
                    "company_name": j.get("company_name"),
                    "company_logo": j.get("company_logo"),
                    "description": j.get("description"),
                    "source_name": j.get("source_name"),
                    "source_job_id": str(j.get("source_job_id") or j.get("id", "")),
                    "original_url": j.get("original_url"),
                    "application_url": j.get("application_url"),
                    "location": j.get("location"),
                    "work_mode": j.get("work_mode", "onsite"),
                    "job_type": j.get("job_type", "full-time"),
                    "salary_min": j.get("salary_min"),
                    "salary_max": j.get("salary_max"),
                    "stipend": j.get("stipend"),
                    "currency": j.get("currency", "USD"),
                    "paid_status": j.get("paid_status", "paid"),
                    "required_skills": j.get("required_skills", []),
                    "minimum_cgpa": j.get("minimum_cgpa"),
                    "eligible_branches": j.get("eligible_branches", []),
                    "eligible_graduation_years": j.get("eligible_graduation_years", []),
                    "description_hash": j.get("description_hash"),
                    "status": "active"
                })

            # Upsert in batches of 50 to prevent payload overflow
            batch_size = 50
            synced = 0
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                client.table("jobs").upsert(batch, on_conflict="description_hash").execute()
                synced += len(batch)
            print(f"[Database] Successfully upserted {synced} opportunities to Supabase!")

            # Log collection run
            client.table("collection_logs").insert({
                "source_name": "Multi-Source Collector",
                "jobs_found": len(all_jobs),
                "jobs_ingested": len(unique),
                "status": "success"
            }).execute()

        except Exception as sync_err:
            print(f"[Database Warning] Supabase sync skipped/deferred: {sync_err}")

    if unique:
        first = unique[0]
        print("\n[Sample Verified Listing]:")
        print({
            "title": first.get("title"),
            "company": first.get("company_name"),
            "location": first.get("location"),
            "work_mode": first.get("work_mode"),
            "source": first.get("source_name"),
            "sha256": first.get("description_hash", "")[:16] + "..."
        })


if __name__ == "__main__":
    asyncio.run(main())
