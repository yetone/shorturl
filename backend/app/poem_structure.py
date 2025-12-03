"""
VerseCraft Poem Structure Analysis Module

Provides functions to analyze poem structure coherence including:
- Stanza organization and line structure
- Meter and line length consistency
- Grammatical coherence checks
"""

import re
import statistics
from typing import List, Dict, Any


def get_lines(poem: str) -> List[str]:
    """
    Extract all non-empty lines from a poem.

    Args:
        poem: The poem text to analyze

    Returns:
        List[str]: List of non-empty lines
    """
    lines = poem.strip().split('\n')
    return [line for line in lines if line.strip()]


def get_stanzas(poem: str) -> List[str]:
    """
    Extract stanzas from a poem (separated by blank lines).

    Args:
        poem: The poem text to analyze

    Returns:
        List[str]: List of stanzas (each stanza is a string)
    """
    # Split by double newlines or blank lines
    stanzas = re.split(r'\n\s*\n', poem.strip())
    return [s.strip() for s in stanzas if s.strip()]


def count_lines(poem: str) -> int:
    """
    Count the number of non-empty lines in a poem.

    Args:
        poem: The poem text to analyze

    Returns:
        int: Number of non-empty lines
    """
    return len(get_lines(poem))


def count_stanzas(poem: str) -> int:
    """
    Count the number of stanzas in a poem.

    Args:
        poem: The poem text to analyze

    Returns:
        int: Number of stanzas
    """
    return len(get_stanzas(poem))


def has_stanza_structure(poem: str) -> bool:
    """
    Check if poem has recognizable stanza structure.

    A poem has stanza structure if:
    - It has at least one stanza
    - Each stanza has multiple lines
    - There is visual separation between stanzas (blank lines)

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem has stanza structure
    """
    stanzas = get_stanzas(poem)

    if len(stanzas) < 1:
        return False

    # Check that at least one stanza has multiple lines
    for stanza in stanzas:
        lines = [line for line in stanza.split('\n') if line.strip()]
        if len(lines) > 1:
            return True

    return False


def analyze_line_lengths(poem: str) -> Dict[str, float]:
    """
    Analyze line lengths in a poem.

    Args:
        poem: The poem text to analyze

    Returns:
        dict: Analysis containing avg_words_per_line, min_words, max_words, std_dev_words
    """
    lines = get_lines(poem)
    words_per_line = []

    for line in lines:
        # Count words in each line
        words = re.findall(r'\b\w+\b', line)
        words_per_line.append(len(words))

    if not words_per_line:
        return {
            'avg_words_per_line': 0,
            'min_words': 0,
            'max_words': 0,
            'std_dev_words': 0
        }

    avg_words = statistics.mean(words_per_line)
    std_dev = statistics.stdev(words_per_line) if len(words_per_line) > 1 else 0

    return {
        'avg_words_per_line': avg_words,
        'min_words': min(words_per_line),
        'max_words': max(words_per_line),
        'std_dev_words': std_dev
    }


def has_consistent_meter_pattern(poem: str) -> bool:
    """
    Check if poem has consistent meter pattern.

    A poem has consistent meter if:
    - Line lengths are relatively consistent (not wildly varying)
    - Stanzas have similar structures

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem has consistent meter pattern
    """
    analysis = analyze_line_lengths(poem)

    # Check for reasonable line length (not too short or too long on average)
    if analysis['avg_words_per_line'] < 2 or analysis['avg_words_per_line'] > 20:
        return False

    # Check that line length variance is not extreme
    # Standard deviation should be reasonable for poetry
    if analysis['std_dev_words'] > 6:
        return False

    # Check that stanzas have similar line counts
    stanzas = get_stanzas(poem)
    if len(stanzas) > 1:
        stanza_line_counts = [len(s.strip().split('\n')) for s in stanzas]
        stanza_variance = max(stanza_line_counts) - min(stanza_line_counts)
        if stanza_variance > 3:
            return False

    return True


def is_grammatically_coherent(poem: str) -> bool:
    """
    Check if poem is grammatically coherent.

    A poem is grammatically coherent if:
    - Lines contain readable words
    - Proper punctuation is present
    - Lines begin with capital letters
    - No empty lines within stanzas

    Args:
        poem: The poem text to analyze

    Returns:
        bool: True if poem is grammatically coherent
    """
    lines = get_lines(poem)

    if not lines:
        return False

    # Check for presence of punctuation (indicates sentence structure)
    has_punctuation = any(c in poem for c in '.!?,;:—')
    if not has_punctuation:
        return False

    # Check that lines contain readable words
    for line in lines:
        words = re.findall(r'\b[a-zA-Z]+\b', line)
        if len(words) == 0:
            return False

    # Check for proper capitalization (first char of lines)
    for line in lines:
        stripped = line.strip()
        if stripped:
            first_char = stripped[0]
            # First character should be uppercase or a quote mark
            if not (first_char.isupper() or first_char in '"\'("'):
                return False

    return True


def analyze_poem_structure(poem: str) -> Dict[str, Any]:
    """
    Perform comprehensive analysis of poem structure.

    Args:
        poem: The poem text to analyze

    Returns:
        dict: Complete structural analysis including:
            - total_lines: Number of lines
            - total_stanzas: Number of stanzas
            - lines_per_stanza: List of line counts per stanza
            - has_stanza_structure: Boolean
            - has_consistent_meter: Boolean
            - is_grammatically_coherent: Boolean
            - avg_words_per_line: Average words per line
    """
    stanzas = get_stanzas(poem)
    lines_per_stanza = [len(s.strip().split('\n')) for s in stanzas]
    line_analysis = analyze_line_lengths(poem)

    return {
        'total_lines': count_lines(poem),
        'total_stanzas': count_stanzas(poem),
        'lines_per_stanza': lines_per_stanza,
        'has_stanza_structure': has_stanza_structure(poem),
        'has_consistent_meter': has_consistent_meter_pattern(poem),
        'is_grammatically_coherent': is_grammatically_coherent(poem),
        'avg_words_per_line': line_analysis['avg_words_per_line']
    }
