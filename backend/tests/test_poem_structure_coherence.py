"""
Tests for VerseCraft Poem Structure Coherence (REQ-4)

Scenario: Poem Structure Coherence
Verifies that generated poems maintain coherent structure with rhyme, meter, or free verse.
This includes organization into stanzas, consistent line patterns, and readable grammar.
"""

import sys
import os
import unittest
import re

# Add backend app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.poem_generator import (
    generate_poem,
    generate_multiple_poems,
    POEM_TEMPLATES
)

# Import structure validation functions (to be implemented)
from app.poem_structure import (
    get_stanzas,
    get_lines,
    count_stanzas,
    count_lines,
    has_stanza_structure,
    analyze_line_lengths,
    has_consistent_meter_pattern,
    is_grammatically_coherent,
    analyze_poem_structure
)


class TestPoemStanzaOrganization(unittest.TestCase):
    """Test Case 1: Poem contains multiple lines organized into stanzas or verses"""

    def test_generated_poem_has_multiple_lines(self):
        """Verify generated poem contains multiple lines"""
        poem = generate_poem()
        lines = get_lines(poem)
        self.assertGreater(
            len(lines), 1,
            f"Generated poem should contain multiple lines. Found: {len(lines)} lines"
        )

    def test_generated_poem_has_stanzas(self):
        """Verify generated poem is organized into stanzas"""
        poem = generate_poem()
        stanzas = get_stanzas(poem)
        self.assertGreater(
            len(stanzas), 0,
            "Generated poem should contain at least one stanza"
        )

    def test_poem_has_multiple_stanzas(self):
        """Verify generated poem has multiple stanzas (verses)"""
        poem = generate_poem()
        stanza_count = count_stanzas(poem)
        self.assertGreaterEqual(
            stanza_count, 2,
            f"Generated poem should have at least 2 stanzas. Found: {stanza_count}"
        )

    def test_all_templates_have_stanza_structure(self):
        """Verify all poem templates are organized into stanzas"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    has_stanza_structure(poem),
                    f"Poem template {i} should have recognizable stanza structure"
                )

    def test_stanzas_contain_multiple_lines(self):
        """Verify each stanza contains multiple lines"""
        poem = generate_poem()
        stanzas = get_stanzas(poem)
        for i, stanza in enumerate(stanzas):
            with self.subTest(stanza_index=i):
                lines = stanza.strip().split('\n')
                self.assertGreater(
                    len(lines), 1,
                    f"Stanza {i} should contain multiple lines"
                )

    def test_all_templates_have_adequate_line_count(self):
        """Verify all poem templates have sufficient number of lines"""
        min_expected_lines = 8  # Minimum lines for a coherent poem
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                line_count = count_lines(poem)
                self.assertGreaterEqual(
                    line_count, min_expected_lines,
                    f"Template {i} should have at least {min_expected_lines} lines. Found: {line_count}"
                )

    def test_multiple_generated_poems_have_structure(self):
        """Verify multiple generated poems all have stanza structure"""
        poems = generate_multiple_poems(count=5)
        for i, poem in enumerate(poems):
            with self.subTest(poem_index=i):
                self.assertTrue(
                    has_stanza_structure(poem),
                    f"Generated poem {i} should have stanza structure"
                )


class TestPoemMeterConsistency(unittest.TestCase):
    """Test Case 2: Poem maintains consistent line length or meter pattern"""

    def test_generated_poem_has_reasonable_line_lengths(self):
        """Verify generated poem has reasonable line lengths for poetry"""
        poem = generate_poem()
        analysis = analyze_line_lengths(poem)

        # Lines should not be too short (< 3 words) or too long (> 15 words)
        self.assertGreaterEqual(
            analysis['avg_words_per_line'], 3,
            "Average words per line should be at least 3"
        )
        self.assertLessEqual(
            analysis['avg_words_per_line'], 15,
            "Average words per line should not exceed 15"
        )

    def test_line_length_variance_within_stanzas(self):
        """Verify line lengths within stanzas have reasonable variance"""
        poem = generate_poem()
        analysis = analyze_line_lengths(poem)

        # Line length standard deviation should be reasonable for poetry
        # Poetry typically has varied but controlled line lengths
        self.assertLessEqual(
            analysis['std_dev_words'], 5,
            f"Line length variance should not be extreme. Std dev: {analysis['std_dev_words']}"
        )

    def test_all_templates_have_consistent_meter(self):
        """Verify all templates have some meter consistency"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    has_consistent_meter_pattern(poem),
                    f"Template {i} should have consistent meter pattern"
                )

    def test_stanzas_have_similar_structure(self):
        """Verify stanzas within a poem have similar line counts"""
        poem = generate_poem()
        stanzas = get_stanzas(poem)
        if len(stanzas) < 2:
            self.skipTest("Poem has fewer than 2 stanzas")

        stanza_line_counts = [len(s.strip().split('\n')) for s in stanzas]
        # For structured poetry, stanzas typically have similar line counts
        variance = max(stanza_line_counts) - min(stanza_line_counts)
        self.assertLessEqual(
            variance, 2,
            f"Stanza line counts should be relatively consistent. Counts: {stanza_line_counts}"
        )

    def test_lines_not_excessively_long(self):
        """Verify no lines are excessively long"""
        poem = generate_poem()
        lines = get_lines(poem)
        max_chars = 80  # Reasonable max for poetry line

        for i, line in enumerate(lines):
            with self.subTest(line_index=i):
                self.assertLessEqual(
                    len(line), max_chars,
                    f"Line {i} exceeds {max_chars} characters: '{line[:50]}...'"
                )


class TestPoemGrammaticalCoherence(unittest.TestCase):
    """Test Case 3: Poem is readable and grammatically coherent"""

    def test_generated_poem_is_grammatically_coherent(self):
        """Verify generated poem has grammatical coherence"""
        poem = generate_poem()
        self.assertTrue(
            is_grammatically_coherent(poem),
            "Generated poem should be grammatically coherent"
        )

    def test_poem_contains_complete_sentences(self):
        """Verify poem contains sentences with proper structure"""
        poem = generate_poem()
        # Check for presence of sentence-ending punctuation
        has_punctuation = any(c in poem for c in '.!?,;:')
        self.assertTrue(
            has_punctuation,
            "Poem should contain punctuation indicating sentence structure"
        )

    def test_poem_lines_not_empty_or_whitespace(self):
        """Verify no lines are empty or just whitespace within stanzas"""
        poem = generate_poem()
        stanzas = get_stanzas(poem)
        for stanza_idx, stanza in enumerate(stanzas):
            lines = stanza.split('\n')
            for line_idx, line in enumerate(lines):
                with self.subTest(stanza=stanza_idx, line=line_idx):
                    self.assertTrue(
                        len(line.strip()) > 0,
                        f"Line should not be empty within stanza {stanza_idx}"
                    )

    def test_all_templates_grammatically_coherent(self):
        """Verify all templates are grammatically coherent"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                self.assertTrue(
                    is_grammatically_coherent(poem),
                    f"Template {i} should be grammatically coherent"
                )

    def test_poem_words_are_readable(self):
        """Verify poem contains readable English words"""
        poem = generate_poem()
        lines = get_lines(poem)

        for line_idx, line in enumerate(lines):
            words = re.findall(r'\b[a-zA-Z]+\b', line)
            with self.subTest(line_index=line_idx):
                self.assertGreater(
                    len(words), 0,
                    f"Line {line_idx} should contain readable words"
                )

    def test_poem_has_proper_capitalization(self):
        """Verify poem lines start with proper capitalization"""
        poem = generate_poem()
        lines = get_lines(poem)

        for i, line in enumerate(lines):
            with self.subTest(line_index=i):
                first_char = line.strip()[0] if line.strip() else ''
                # First character should typically be uppercase in poetry
                self.assertTrue(
                    first_char.isupper() or first_char in '"\'',
                    f"Line {i} should start with capital letter: '{line[:20]}'"
                )


class TestPoemStructureComprehensive(unittest.TestCase):
    """Comprehensive integration tests for poem structure analysis"""

    def test_analyze_poem_structure_returns_complete_analysis(self):
        """Verify analyze_poem_structure returns all expected fields"""
        poem = generate_poem()
        analysis = analyze_poem_structure(poem)

        expected_fields = [
            'total_lines', 'total_stanzas', 'lines_per_stanza',
            'has_stanza_structure', 'has_consistent_meter',
            'is_grammatically_coherent', 'avg_words_per_line'
        ]

        for field in expected_fields:
            with self.subTest(field=field):
                self.assertIn(
                    field, analysis,
                    f"Analysis should include '{field}' field"
                )

    def test_all_templates_pass_structure_analysis(self):
        """Verify all templates pass comprehensive structure analysis"""
        for i, poem in enumerate(POEM_TEMPLATES):
            with self.subTest(template_index=i):
                analysis = analyze_poem_structure(poem)
                self.assertTrue(
                    analysis['has_stanza_structure'],
                    f"Template {i} should have stanza structure"
                )
                self.assertTrue(
                    analysis['has_consistent_meter'],
                    f"Template {i} should have consistent meter"
                )
                self.assertTrue(
                    analysis['is_grammatically_coherent'],
                    f"Template {i} should be grammatically coherent"
                )

    def test_repeated_generation_maintains_structure(self):
        """Verify repeated poem generation maintains structure"""
        for iteration in range(10):
            with self.subTest(iteration=iteration):
                poem = generate_poem()
                analysis = analyze_poem_structure(poem)

                self.assertTrue(
                    analysis['has_stanza_structure'],
                    "Generated poem should have stanza structure"
                )
                self.assertGreaterEqual(
                    analysis['total_lines'], 8,
                    "Generated poem should have adequate lines"
                )
                self.assertGreaterEqual(
                    analysis['total_stanzas'], 2,
                    "Generated poem should have multiple stanzas"
                )


if __name__ == "__main__":
    unittest.main(verbosity=2)
