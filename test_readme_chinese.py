"""
Tests for verifying the Chinese README file creation and structure.
"""

import os
import re
import unittest


class TestChineseReadmeValidation(unittest.TestCase):
    """Test suite for Chinese README file validation."""

    def setUp(self):
        """Set up paths for README files."""
        self.repo_root = os.path.dirname(os.path.abspath(__file__))
        self.english_readme_path = os.path.join(self.repo_root, "README.md")
        self.chinese_readme_path = os.path.join(self.repo_root, "README.zh-CN.md")

    def test_test_case_1_file_exists(self):
        """
        Test Case 1: Check for existence of README.zh-CN.md in repository root
        Expected: File exists and is accessible at the repository root level
        """
        file_exists = os.path.exists(self.chinese_readme_path)
        self.assertTrue(file_exists,
                       "README.zh-CN.md should exist in the repository root")

    def test_test_case_2_utf8_encoding(self):
        """
        Test Case 2: Verify UTF-8 encoding for Chinese characters
        Expected: File opens correctly in editors and GitHub displays Chinese characters without garbling
        """
        with open(self.chinese_readme_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for Chinese characters (unicode range for Chinese)
        has_chinese_chars = bool(re.search(r'[\u4e00-\u9fff]', content))
        self.assertTrue(has_chinese_chars,
                       "File should contain Chinese characters")

        # Check that the file includes common Chinese phrases
        chinese_phrases = [
            "短链接服务",
            "URL缩短",
            "后端",
            "前端",
            "入门指南",
            "许可证"
        ]

        for phrase in chinese_phrases:
            self.assertIn(phrase, content,
                         f"Chinese phrase '{phrase}' should be present in the file")

    def test_test_case_3_markdown_structure(self):
        """
        Test Case 3: Validate markdown structure (headers, sections, formatting)
        Expected: File uses proper markdown syntax with consistent heading levels and formatting
        """
        with open(self.chinese_readme_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check all required sections are present
        required_sections = [
            "短链接服务",  # Main title
            "特性",        # Features
            "技术栈",      # Tech Stack
            "后端",        # Backend
            "前端",        # Frontend
            "入门指南",    # Getting Started
            "前提条件",    # Prerequisites
            "后端设置",    # Backend Setup
            "前端设置",    # Frontend Setup
            "API文档",     # API Documentation
            "许可证"       # License
        ]

        for section in required_sections:
            self.assertIn(section, content,
                         f"Section '{section}' should be present in the Chinese README")

        # Check for proper markdown headers (H1, H2, H3)
        lines = content.split('\n')
        self.assertTrue(lines[2].startswith('# '),
                       "Main title should use H1 (#) format")

        # Check for H2 headers (##)
        h2_headers = [line for line in lines if line.startswith('## ')]
        self.assertGreaterEqual(len(h2_headers), 5,
                              "Should have at least 5 H2 headers")

        # Check for H3 headers (###)
        h3_headers = [line for line in lines if line.startswith('### ')]
        self.assertGreaterEqual(len(h3_headers), 3,
                              "Should have at least 3 H3 headers")

        # Check code blocks are preserved (should have ### before code blocks)
        code_block_count = content.count('```bash')
        self.assertGreaterEqual(code_block_count, 4,
                              "Should have at least 4 bash code blocks")

        # Verify ordered lists are present (setup instructions)
        # Chinese version may have fewer numbered items due to formatting
        ordered_list_items = len(re.findall(r'\d+\.', content))
        self.assertGreaterEqual(ordered_list_items, 10,
                              "Should have at least 10 ordered list items (setup steps)")

        # Check for code blocks with triple backticks
        triple_backticks = content.count('```')
        self.assertGreaterEqual(triple_backticks, 10,
                              "Should have at least 10 backticks for code block markers (each block = 2 backticks)")

    def test_language_navigation_links(self):
        """
        Additional test: Verify language navigation links exist
        Required by REQ-7
        """
        with open(self.chinese_readme_path, 'r', encoding='utf-8') as f:
            chinese_content = f.read()

        with open(self.english_readme_path, 'r', encoding='utf-8') as f:
            english_content = f.read()

        # Check navigation links in both files
        navigation_pattern = r'\[English\]\(README\.md\).+\[简体中文\]\(README\.zh-CN\.md\)'

        chinese_has_navigation = bool(re.search(navigation_pattern, chinese_content))
        english_has_navigation = bool(re.search(navigation_pattern, english_content))

        self.assertTrue(chinese_has_navigation,
                       "Chinese README should have navigation links at the top")
        self.assertTrue(english_has_navigation,
                       "English README should have navigation links at the top")

    def test_content_parity_with_english(self):
        """
        Additional test: Verify content parity with English README
        Required by REQ-2 through REQ-6
        """
        with open(self.english_readme_path, 'r', encoding='utf-8') as f:
            english_content = f.read()

        with open(self.chinese_readme_path, 'r', encoding='utf-8') as f:
            chinese_content = f.read()

        # Check that code blocks are preserved (URLs and commands not translated)
        # Extract URLs from both files
        english_urls = re.findall(r'http[s]?://[^\s\)\]]+', english_content)
        chinese_urls = re.findall(r'http[s]?://[^\s\)\]]+', chinese_content)

        self.assertEqual(len(english_urls), len(chinese_urls),
                        "Should have same number of URLs as English version")

        for i, url in enumerate(english_urls):
            self.assertEqual(url, chinese_urls[i],
                           f"URL {i} should match English version: {url}")

        # Check that bash commands are preserved
        english_bash_blocks = re.findall(r'```bash(.*?)```', english_content, re.DOTALL)
        chinese_bash_blocks = re.findall(r'```bash(.*?)```', chinese_content, re.DOTALL)

        self.assertEqual(len(english_bash_blocks), len(chinese_bash_blocks),
                        "Should have same number of bash code blocks")

        for i, block in enumerate(english_bash_blocks):
            # Clean and compare commands (strip whitespace)
            english_commands = block.strip()
            chinese_commands = chinese_bash_blocks[i].strip()
            self.assertEqual(english_commands, chinese_commands,
                           f"Command block {i} should match English version")


if __name__ == '__main__':
    unittest.main()
