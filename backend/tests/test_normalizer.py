from app.services.normalizer import NormalizerService


def test_url_normalization_strips_tracking():
    dirty = "https://jobs.example.com/posting/42?utm_source=linkedin&utm_medium=social&ref=partner#apply"
    clean = NormalizerService.normalize_url(dirty)
    assert "utm_source" not in clean
    assert "ref=" not in clean
    assert clean == "https://jobs.example.com/posting/42#apply"


def test_description_hashing_consistency():
    text1 = "<p>We are looking for a React developer in Bengaluru.</p>"
    text2 = "  We ARE looking for a React developer in Bengaluru.  "
    hash1 = NormalizerService.generate_description_hash(text1)
    hash2 = NormalizerService.generate_description_hash(text2)
    assert len(hash1) == 64
    assert hash1 == hash2


def test_duplicate_filtering():
    jobs = [
        {"title": "Role A", "description": "Identical posting"},
        {"title": "Role B (Duplicate)", "description": "Identical posting"},
        {"title": "Role C (Unique)", "description": "Unique role"}
    ]
    processed = [NormalizerService.process_job(j) for j in jobs]
    unique, duplicates = NormalizerService.filter_duplicates(processed)
    assert len(unique) == 2
    assert len(duplicates) == 1
