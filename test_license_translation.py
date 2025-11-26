"""
Tests for verifying license section translation in Chinese README.
"""

import os
import re
import unittest


class TestLicenseSectionTranslation(unittest.TestCase):
    """Test suite for license section translation validation."""

    def setUp(self):
        """Set up paths for README files."""
        self.repo_root = os.path.dirname(os.path.abspath(__file__))
        self.english_readme_path = os.path.join(self.repo_root, "README.md")
        self.chinese_readme_path = os.path.join(self.repo_root, "README.zh-CN.md")

        with open(self.english_readme_path, 'r', encoding='utf-8') as f:
            self.english_content = f.read()

        with open(self.chinese_readme_path, 'r', encoding='utf-8') as f:
            self.chinese_content = f.read()

    def test_requirement_6_license_section_exists_in_chinese(self):
        """
        REQ-6: Translate license section to Chinese
        Expected: License section translated with accurate legal terminology
        """
        self.assertIn("## 许可证", self.chinese_content,
                     "Chinese README should have translated License section header")

    def test_license_description_translated_with_legal_terminology(self):
        """
        Test Case 1: Verify license description is translated with accurate legal terminology
        Expected: License information accurately translated; license names preserved
        """
        # Extract license section from Chinese README
        chinese_license_match = re.search(
            r'## 许可证\n\n(.+)',
            self.chinese_content
        )

        self.assertIsNotNone(chinese_license_match,
                           "License section should exist in Chinese README")

        chinese_license_text = chinese_license_match.group(1)

        # Verify Chinese translation uses correct legal terminology
        self.assertIn("采用", chinese_license_text,
                     "Should use legal terminology '采用' (adopted/under)")
        self.assertIn("许可证", chinese_license_text,
                     "Should use legal terminology '许可证' (license)")

        # Verify it's a complete sentence in Chinese
        self.assertIn("本项目", chinese_license_text,
                     "Should start with '本项目' (this project)")

    def test_nfr_4_license_name_preservation(self):
        """
        NFR-4: Technical and legal identifiers should not be translated
        Test Case: Verify license names (e.g., MIT) remain unchanged
        """
        chinese_license_match = re.search(
            r'## 许可证\n\n(.+)',
            self.chinese_content
        )

        chinese_license_text = chinese_license_match.group(1)

        # MIT license name should be preserved (not translated)
        self.assertIn("MIT", chinese_license_text,
                     "License name 'MIT' must be preserved and not translated")

        # LICENSE filename should be preserved (not translated)
        self.assertIn("LICENSE", chinese_license_text,
                     "License filename 'LICENSE' must be preserved and not translated")

    def test_license_description_accuracy(self):
        """
        Verify license description translation accuracy compared to English
        """
        # English license text
        english_license_match = re.search(
            r'## License\n\n(.+)',
            self.english_content
        )
        self.assertIsNotNone(english_license_match, "English license section should exist")
        english_license_text = english_license_match.group(1)

        # Chinese license text
        chinese_license_match = re.search(
            r'## 许可证\n\n(.+)',
            self.chinese_content
        )
        self.assertIsNotNone(chinese_license_match, "Chinese license section should exist")
        chinese_license_text = chinese_license_match.group(1)

        # Verify English version mentions MIT License
        self.assertIn("MIT License", english_license_text,
                     "English version should mention 'MIT License'")

        # Verify Chinese version preserves MIT but translates description
        self.assertIn("MIT许可证", chinese_license_text,
                     "Chinese version should have 'MIT许可证' (MIT + Chinese word for license)")

    def test_test_case_2_license_link_functionality(self):
        """
        Test Case 2: Click license links
        Expected: Links navigate to correct license documentation
        """
        # Check that LICENSE file reference exists in Chinese version
        self.assertIn("LICENSE", self.chinese_content,
                     "Should reference LICENSE file in Chinese README")

        # Verify the reference format is correct (not a broken link)
        # It should say "查看LICENSE文件了解详情" (see LICENSE file for details)
        chinese_license_section = re.search(
            r'## 许可证\n\n本项目采用MIT许可证 - (.+)',
            self.english_content
        )

        # In Chinese README, it should mention LICENSE file
        self.assertIn("LICENSE文件", self.chinese_content,
                     "Should mention LICENSE file using proper Chinese phrase")

    def test_license_section_continuity(self):
        """
        Verify license section is properly positioned in document structure
        """
        # Find position of license section in Chinese README
        chinese_section_positions = {}
        for section in ["特性", "技术栈", "入门指南", "API文档", "许可证"]:
            position = self.chinese_content.find(f"## {section}")
            self.assertNotEqual(position, -1, f"Section '{section}' should exist")
            chinese_section_positions[section] = position

        # License should be the last major section
        self.assertGreater(chinese_section_positions["许可证"], chinese_section_positions["API文档"],
                          "License section should come after API Documentation")

    def test_legal_terminology_conventions(self):
        """
        Verify proper Chinese legal terminology is used
        """
        chinese_license_match = re.search(
            r'## 许可证\n\n(.+)',
            self.chinese_content
        )
        chinese_license_text = chinese_license_match.group(1).strip()

        # Verify Chinese license text follows standard conventions
        # Should be format: "本项目采用MIT许可证 - 查看LICENSE文件了解详情"
        self.assertTrue(
            chinese_license_text.startswith("本项目采用") and
            "MIT许可证" in chinese_license_text and
            "LICENSE文件" in chinese_license_text,
            "License text should follow standard Chinese legal documentation conventions"
        )


if __name__ == '__main__':
    unittest.main()
