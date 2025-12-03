"""
Tests for VerseCraft Poem Domain Relevance (REQ-2)

Scenario: Poem Content Relevance - Domain Keywords
Verifies that generated poems are relevant to the product domain
including links, URLs, analytics, tracking, and connectivity.
"""

import sys
import os
import unittest

# Add backend app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.poem_generator import (
    generate_poem,
    generate_multiple_poems,
    contains_url_link_keywords,
    contains_analytics_tracking_keywords,
    contains_connectivity_sharing_keywords,
    is_domain_relevant,
    get_domain_keywords_found,
    URL_LINK_KEYWORDS,
    ANALYTICS_TRACKING_KEYWORDS,
    CONNECTIVITY_SHARING_KEYWORDS,
    POEM_TEMPLATES
)


class TestPoemUrlLinkKeywords(unittest.TestCase):
    """Test Case 1: Poem contains at least one reference to URL/link shortening concepts"""

    def test_generated_poem_contains_url_link_keywords(self):
        """Verify generated poem contains URL/link shortening keywords"""
        poem = generate_poem()
        self.assertTrue(
            contains_url_link_keywords(poem),
            f"Generated poem should contain URL/link keywords. "
            f"Expected at least one of: {URL_LINK_KEYWORDS}"
        )

    def test_all_templates_contain_url_link_keywords(self):
        """Verify all poem templates contain URL/link keywords"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    contains_url_link_keywords(poem),
                    f"Poem template {i} should contain URL/link keywords. "
                    f"Expected at least one of: {URL_LINK_KEYWORDS}"
                )

    def test_url_keyword_detection_case_insensitive(self):
        """Verify keyword detection is case insensitive"""
        test_poem = "This poem talks about a URL and a Link."
        self.assertTrue(contains_url_link_keywords(test_poem))

    def test_url_keywords_found_details(self):
        """Verify specific URL/link keywords can be identified"""
        poem = generate_poem()
        keywords_found = get_domain_keywords_found(poem)
        self.assertGreater(
            len(keywords_found["url_link"]), 0,
            "Should find at least one URL/link keyword in generated poem"
        )


class TestPoemAnalyticsTrackingKeywords(unittest.TestCase):
    """Test Case 2: Poem contains references to analytics or tracking concepts"""

    def test_generated_poem_contains_analytics_keywords(self):
        """Verify generated poem contains analytics/tracking keywords"""
        poem = generate_poem()
        self.assertTrue(
            contains_analytics_tracking_keywords(poem),
            f"Generated poem should contain analytics/tracking keywords. "
            f"Expected at least one of: {ANALYTICS_TRACKING_KEYWORDS}"
        )

    def test_all_templates_contain_analytics_keywords(self):
        """Verify all poem templates contain analytics/tracking keywords"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    contains_analytics_tracking_keywords(poem),
                    f"Poem template {i} should contain analytics/tracking keywords. "
                    f"Expected at least one of: {ANALYTICS_TRACKING_KEYWORDS}"
                )

    def test_analytics_keyword_detection_case_insensitive(self):
        """Verify analytics keyword detection is case insensitive"""
        test_poem = "Track the Analytics and view the Stats."
        self.assertTrue(contains_analytics_tracking_keywords(test_poem))

    def test_analytics_keywords_found_details(self):
        """Verify specific analytics keywords can be identified"""
        poem = generate_poem()
        keywords_found = get_domain_keywords_found(poem)
        self.assertGreater(
            len(keywords_found["analytics_tracking"]), 0,
            "Should find at least one analytics/tracking keyword in generated poem"
        )


class TestPoemConnectivitySharingKeywords(unittest.TestCase):
    """Test Case 3: Poem contains references to connectivity or sharing concepts"""

    def test_generated_poem_contains_connectivity_keywords(self):
        """Verify generated poem contains connectivity/sharing keywords"""
        poem = generate_poem()
        self.assertTrue(
            contains_connectivity_sharing_keywords(poem),
            f"Generated poem should contain connectivity/sharing keywords. "
            f"Expected at least one of: {CONNECTIVITY_SHARING_KEYWORDS}"
        )

    def test_all_templates_contain_connectivity_keywords(self):
        """Verify all poem templates contain connectivity/sharing keywords"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    contains_connectivity_sharing_keywords(poem),
                    f"Poem template {i} should contain connectivity/sharing keywords. "
                    f"Expected at least one of: {CONNECTIVITY_SHARING_KEYWORDS}"
                )

    def test_connectivity_keyword_detection_case_insensitive(self):
        """Verify connectivity keyword detection is case insensitive"""
        test_poem = "Share and Connect across the Network."
        self.assertTrue(contains_connectivity_sharing_keywords(test_poem))

    def test_connectivity_keywords_found_details(self):
        """Verify specific connectivity keywords can be identified"""
        poem = generate_poem()
        keywords_found = get_domain_keywords_found(poem)
        self.assertGreater(
            len(keywords_found["connectivity_sharing"]), 0,
            "Should find at least one connectivity/sharing keyword in generated poem"
        )


class TestMultiplePoemDomainRelevance(unittest.TestCase):
    """Test Case 4: Integration test - Multiple poem generations maintain domain relevance"""

    def test_multiple_poems_all_domain_relevant(self):
        """Verify multiple generated poems all maintain domain relevance"""
        poems = generate_multiple_poems(count=5)
        for i, poem in enumerate(poems):
            with self.subTest(poem_index=i):
                self.assertTrue(
                    is_domain_relevant(poem),
                    f"Poem {i} should be domain relevant"
                )

    def test_all_generated_poems_contain_url_keywords(self):
        """Verify all generated poems contain URL/link keywords"""
        poems = generate_multiple_poems(count=8)
        for i, poem in enumerate(poems):
            with self.subTest(poem_index=i):
                self.assertTrue(
                    contains_url_link_keywords(poem),
                    f"Poem {i} should contain URL/link keywords"
                )

    def test_all_generated_poems_contain_analytics_keywords(self):
        """Verify all generated poems contain analytics keywords"""
        poems = generate_multiple_poems(count=8)
        for i, poem in enumerate(poems):
            with self.subTest(poem_index=i):
                self.assertTrue(
                    contains_analytics_tracking_keywords(poem),
                    f"Poem {i} should contain analytics/tracking keywords"
                )

    def test_all_generated_poems_contain_connectivity_keywords(self):
        """Verify all generated poems contain connectivity keywords"""
        poems = generate_multiple_poems(count=8)
        for i, poem in enumerate(poems):
            with self.subTest(poem_index=i):
                self.assertTrue(
                    contains_connectivity_sharing_keywords(poem),
                    f"Poem {i} should contain connectivity/sharing keywords"
                )

    def test_generate_multiple_returns_unique_poems(self):
        """Verify generate_multiple_poems returns unique poems"""
        poems = generate_multiple_poems(count=5)
        self.assertEqual(
            len(poems), len(set(poems)),
            "Generated poems should all be unique"
        )

    def test_repeated_generation_maintains_relevance(self):
        """Verify repeated poem generation maintains domain relevance"""
        for iteration in range(20):
            with self.subTest(iteration=iteration):
                poem = generate_poem()
                self.assertTrue(
                    is_domain_relevant(poem),
                    "Each generated poem should be domain relevant"
                )
                self.assertTrue(
                    contains_url_link_keywords(poem),
                    "Each generated poem should contain URL/link keywords"
                )
                self.assertTrue(
                    contains_analytics_tracking_keywords(poem),
                    "Each generated poem should contain analytics keywords"
                )
                self.assertTrue(
                    contains_connectivity_sharing_keywords(poem),
                    "Each generated poem should contain connectivity keywords"
                )


class TestDomainKeywordsComprehensive(unittest.TestCase):
    """Additional comprehensive tests for domain keyword coverage"""

    def test_poem_contains_all_three_keyword_categories(self):
        """Verify generated poem contains keywords from all three categories"""
        poem = generate_poem()
        keywords_found = get_domain_keywords_found(poem)

        self.assertGreater(
            len(keywords_found["url_link"]), 0,
            "Poem should contain URL/link keywords"
        )
        self.assertGreater(
            len(keywords_found["analytics_tracking"]), 0,
            "Poem should contain analytics/tracking keywords"
        )
        self.assertGreater(
            len(keywords_found["connectivity_sharing"]), 0,
            "Poem should contain connectivity/sharing keywords"
        )

    def test_keyword_lists_are_non_empty(self):
        """Verify keyword lists are properly defined"""
        self.assertGreater(len(URL_LINK_KEYWORDS), 0, "URL/link keywords should be defined")
        self.assertGreater(len(ANALYTICS_TRACKING_KEYWORDS), 0, "Analytics keywords should be defined")
        self.assertGreater(len(CONNECTIVITY_SHARING_KEYWORDS), 0, "Connectivity keywords should be defined")

    def test_poem_templates_non_empty(self):
        """Verify poem templates are properly defined"""
        self.assertGreater(len(POEM_TEMPLATES), 0, "Poem templates should be defined")
        for i, template in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertGreater(len(template.strip()), 0, f"Template {i} should not be empty")

    def test_domain_relevance_function_comprehensive(self):
        """Verify is_domain_relevant function works correctly"""
        # Test with domain-relevant content
        relevant_poem = "This URL shortening service tracks clicks and shares links."
        self.assertTrue(is_domain_relevant(relevant_poem))

        # Test with non-relevant content
        non_relevant_poem = "The sun rises in the east and sets in the west."
        self.assertFalse(is_domain_relevant(non_relevant_poem))

    def test_get_domain_keywords_found_returns_correct_structure(self):
        """Verify get_domain_keywords_found returns correct structure"""
        poem = generate_poem()
        keywords_found = get_domain_keywords_found(poem)

        self.assertIn("url_link", keywords_found)
        self.assertIn("analytics_tracking", keywords_found)
        self.assertIn("connectivity_sharing", keywords_found)

        self.assertIsInstance(keywords_found["url_link"], list)
        self.assertIsInstance(keywords_found["analytics_tracking"], list)
        self.assertIsInstance(keywords_found["connectivity_sharing"], list)


if __name__ == "__main__":
    unittest.main(verbosity=2)
