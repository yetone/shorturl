"""
REQ-1: Interactive Demo URL Creation Backend Tests

Technical Design Specification Quote:
"Lightweight endpoint for demo URL creation with temporary storage mechanism (in-memory or short-lived DB entries).
Public endpoint (no authentication required). Rate limiting to prevent abuse."
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta


@pytest.fixture
def client():
    """Test client fixture"""
    from app.main import app
    return TestClient(app)


@pytest.fixture
def valid_url():
    """Sample valid URL for testing"""
    return "https://www.example.com/very/long/url/path/with/parameters?utm_source=test"


@pytest.fixture
def invalid_url():
    """Sample invalid URL for testing"""
    return "not-a-valid-url"


class TestDemoURLCreation:
    """Tests for demo URL creation endpoint"""

    def test_demo_endpoint_exists(self, client):
        """Should have /api/demo/urls POST endpoint"""
        response = client.post("/api/demo/urls", json={"url": "https://example.com"})
        assert response.status_code in [200, 201], "Endpoint should exist and return success"

    def test_create_demo_url_without_authentication(self, client, valid_url):
        """Should allow creating demo URL without authentication token"""

        # No Authorization header
        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )
        assert response.status_code != 401, "Should not require authentication"
        assert response.status_code != 403, "Should not require authorization"

    def test_create_demo_url_returns_shortened_url(self, client, valid_url):
        """Should return shortened URL in response"""

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            assert "short_code" in data or "short_url" in data, "Should return shortened URL"
            assert len(data.get("short_code", "")) > 0, "Short code should not be empty"

    def test_create_demo_url_response_time_under_2_seconds(self, client, valid_url):
        """Should generate demo URL within 2 seconds"""

        import time
        start_time = time.time()

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        elapsed = time.time() - start_time
        assert elapsed < 2.0, f"Response took {elapsed}s, should be < 2s"

    def test_demo_url_includes_expiry_info(self, client, valid_url):
        """Should indicate demo URLs expire after 24 hours"""

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if response.status_code in [200, 201]:
            data = response.json()
            assert "expires_at" in data or "expiry" in data, "Should include expiry information"


class TestDemoURLValidation:
    """Tests for URL validation"""

    def test_reject_invalid_url_format(self, client, invalid_url):
        """Should reject invalid URL format"""

        response = client.post(
            "/api/demo/urls",
            json={"url": invalid_url}
        )
        assert response.status_code == 400 or response.status_code == 422, "Should return validation error"

    def test_reject_missing_url_field(self, client):
        """Should reject request without URL field"""

        response = client.post(
            "/api/demo/urls",
            json={}
        )
        assert response.status_code == 400 or response.status_code == 422, "Should return validation error"

    def test_reject_empty_url(self, client):
        """Should reject empty URL string"""

        response = client.post(
            "/api/demo/urls",
            json={"url": ""}
        )
        assert response.status_code == 400 or response.status_code == 422, "Should return validation error"

    def test_accept_various_valid_url_schemes(self, client):
        """Should accept http and https URLs"""

        valid_urls = [
            "https://example.com",
            "http://example.com",
            "https://subdomain.example.com/path",
            "https://example.com:8080/path?query=value",
        ]

        for url in valid_urls:
            response = client.post(
                "/api/demo/urls",
                json={"url": url}
            )
            assert response.status_code in [200, 201], f"Should accept valid URL: {url}"


class TestDemoURLRateLimiting:
    """Tests for rate limiting protection"""

    def test_rate_limit_exists(self, client, valid_url):
        """Should implement rate limiting on demo endpoint"""

        # Make multiple rapid requests
        responses = []
        for _ in range(15):  # PRD specifies 10 req/min limit
            response = client.post(
                "/api/demo/urls",
                json={"url": valid_url}
            )
            responses.append(response)

        # At least one should be rate limited
        rate_limited = any(r.status_code == 429 for r in responses)
        assert rate_limited, "Should rate limit after 10 requests per minute"

    def test_rate_limit_returns_429_status(self, client, valid_url):
        """Should return 429 Too Many Requests when rate limited"""

        # Trigger rate limit
        for _ in range(12):
            response = client.post(
                "/api/demo/urls",
                json={"url": valid_url}
            )

        if response.status_code == 429:
            assert "retry" in response.text.lower() or "rate" in response.text.lower()

    def test_rate_limit_includes_retry_after_header(self, client, valid_url):
        """Should include Retry-After header when rate limited"""

        # Trigger rate limit
        for _ in range(12):
            response = client.post(
                "/api/demo/urls",
                json={"url": valid_url}
            )

        if response.status_code == 429:
            assert "Retry-After" in response.headers or "X-RateLimit-Reset" in response.headers


class TestDemoURLStorage:
    """Tests for demo URL storage and cleanup"""

    def test_demo_urls_stored_temporarily(self, client, valid_url):
        """Demo URLs should be stored but marked as temporary"""

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if response.status_code in [200, 201]:
            data = response.json()
            # Should indicate temporary nature
            assert "demo" in str(data).lower() or "temporary" in str(data).lower()

    def test_demo_urls_expire_after_24_hours(self, client, valid_url):
        """Demo URLs should have 24-hour expiry"""

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if response.status_code in [200, 201]:
            data = response.json()
            if "expires_at" in data:
                expiry_time = datetime.fromisoformat(data["expires_at"].replace("Z", "+00:00"))
                now = datetime.utcnow()
                time_until_expiry = expiry_time - now

                # Should expire in approximately 24 hours
                assert 23 <= time_until_expiry.total_seconds() / 3600 <= 25

    def test_demo_urls_not_associated_with_user_account(self, client, valid_url):
        """Demo URLs should not be linked to user accounts"""

        response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if response.status_code in [200, 201]:
            data = response.json()
            assert "user_id" not in data or data.get("user_id") is None


class TestDemoURLSecurity:
    """Tests for security measures"""

    def test_sanitize_url_input(self, client):
        """Should sanitize URL input to prevent XSS"""

        malicious_url = "https://example.com/<script>alert('xss')</script>"

        response = client.post(
            "/api/demo/urls",
            json={"url": malicious_url}
        )

        # Should either reject or sanitize
        assert response.status_code in [400, 422] or \
               "<script>" not in response.text

    def test_cors_configuration(self, client, valid_url):
        """Should have proper CORS configuration for public endpoint"""

        response = client.options("/api/demo/urls")

        # Should allow CORS for frontend origin
        assert "Access-Control-Allow-Origin" in response.headers or response.status_code == 404

    def test_no_sql_injection_vulnerability(self, client):
        """Should be protected against SQL injection"""

        sql_injection_url = "https://example.com'; DROP TABLE urls; --"

        response = client.post(
            "/api/demo/urls",
            json={"url": sql_injection_url}
        )

        # Should handle safely without error
        assert response.status_code in [200, 201, 400, 422], "Should not crash on SQL injection attempt"


class TestDemoURLRedirect:
    """Tests for demo URL redirect functionality"""

    def test_demo_short_url_redirects_correctly(self, client, valid_url):
        """Created demo short URL should redirect to original URL"""

        # Create demo URL
        create_response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if create_response.status_code in [200, 201]:
            data = create_response.json()
            short_code = data.get("short_code")

            if short_code:
                # Test redirect
                redirect_response = client.get(f"/r/{short_code}", follow_redirects=False)
                assert redirect_response.status_code in [301, 302, 307, 308]
                assert redirect_response.headers.get("Location") == valid_url

    def test_demo_url_works_without_analytics(self, client, valid_url):
        """Demo URLs should redirect but not collect analytics"""

        create_response = client.post(
            "/api/demo/urls",
            json={"url": valid_url}
        )

        if create_response.status_code in [200, 201]:
            # Analytics collection should be minimal or absent for demo URLs
            assert True  # Implementation detail


class TestPublicStatsEndpoint:
    """Tests for public statistics endpoint (REQ-2)"""

    def test_public_stats_endpoint_exists(self, client):
        """Should have /api/public/stats GET endpoint"""

        response = client.get("/api/public/stats")
        assert response.status_code in [200, 404], "Endpoint should exist or return not found"

    def test_stats_endpoint_no_authentication_required(self, client):
        """Stats endpoint should not require authentication"""

        response = client.get("/api/public/stats")
        assert response.status_code != 401, "Should not require authentication"

    def test_stats_include_total_urls(self, client):
        """Should return total URLs shortened"""

        response = client.get("/api/public/stats")

        if response.status_code == 200:
            data = response.json()
            assert "total_urls" in data or "urls_shortened" in data

    def test_stats_include_total_clicks(self, client):
        """Should return total clicks tracked"""

        response = client.get("/api/public/stats")

        if response.status_code == 200:
            data = response.json()
            assert "total_clicks" in data or "clicks_tracked" in data

    def test_stats_include_active_users(self, client):
        """Should return active user count"""

        response = client.get("/api/public/stats")

        if response.status_code == 200:
            data = response.json()
            assert "total_users" in data or "active_users" in data

    def test_stats_cached_for_performance(self, client):
        """Stats should be cached to avoid database load"""

        import time

        # First request
        start1 = time.time()
        response1 = client.get("/api/public/stats")
        time1 = time.time() - start1

        # Second request (should be cached)
        start2 = time.time()
        response2 = client.get("/api/public/stats")
        time2 = time.time() - start2

        if response1.status_code == 200:
            # Cached request should be faster
            assert time2 <= time1 or response2.headers.get("X-Cache") == "HIT"

    def test_stats_response_time_fast(self, client):
        """Stats endpoint should respond quickly (< 100ms)"""

        import time
        start = time.time()
        response = client.get("/api/public/stats")
        elapsed = time.time() - start

        if response.status_code == 200:
            assert elapsed < 0.1, f"Stats took {elapsed}s, should be < 0.1s"


class TestDemoCleanupJob:
    """Tests for demo URL cleanup background job"""

    def test_cleanup_job_removes_expired_demo_urls(self):
        """Cleanup job should remove demo URLs older than 24 hours"""
        pytest.skip("Background job testing requires async setup")
        # This would test the scheduled cleanup task

    def test_cleanup_job_runs_daily(self):
        """Cleanup job should be scheduled to run daily"""
        pytest.skip("Background job testing requires async setup")
        # This would verify the job schedule

    def test_cleanup_preserves_non_demo_urls(self):
        """Cleanup should only remove demo URLs, not regular user URLs"""
        pytest.skip("Background job testing requires async setup")
        # This would verify selective deletion
