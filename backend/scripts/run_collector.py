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
