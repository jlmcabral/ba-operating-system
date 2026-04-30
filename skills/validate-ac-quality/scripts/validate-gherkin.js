#!/usr/bin/env node

/**
 * Validates Gherkin-formatted acceptance criteria against formatting rules.
 * Reads from stdin, outputs JSON to stdout.
 * 
 * Validation Rules:
 * 1. Each scenario begins with "Scenario:" followed by a descriptive title
 * 2. Each step keyword (Given, When, Then, And) is on its own line
 * 3. Given, When, Then keywords are wrapped in **bold** markdown
 * 4. And keywords are NOT bold
 * 5. One blank line between scenarios
 */

const readline = require('readline');

async function validateGherkin() {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
  });

  const lines = [];

  // Read all input
  for await (const line of rl) {
    lines.push(line);
  }

  const issues = [];
  let lastScenarioLine = -2; // Track last scenario line for spacing validation

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === '') {
      continue;
    }

    // Check for Scenario line
    if (trimmed.startsWith('Scenario:')) {
      // Validate scenario has a title
      if (trimmed === 'Scenario:') {
        issues.push({
          line: lineNumber,
          rule: 'scenario_title',
          message: 'Scenario must have a descriptive title after "Scenario:"',
          text: line
        });
      }

      // Validate blank line before scenario (except first scenario)
      if (lastScenarioLine >= 0) {
        // Check if there's exactly one blank line before this scenario
        let blankLinesBefore = 0;
        for (let j = i - 1; j >= 0 && lines[j].trim() === ''; j--) {
          blankLinesBefore++;
        }

        if (blankLinesBefore === 0) {
          issues.push({
            line: lineNumber,
            rule: 'scenario_spacing',
            message: 'Missing blank line before scenario',
            text: line
          });
        }
      }

      lastScenarioLine = i;
    }

    // Check for step keywords (Given, When, Then, And)
    const stepKeywordRegex = /^(\*\*)?(?:Given|When|Then|And)(\*\*)?(?:\s|$)/;
    const stepMatch = trimmed.match(stepKeywordRegex);

    if (stepMatch) {
      // Extract the keyword
      const keywordMatch = trimmed.match(/^(\*\*)?(?:(Given|When|Then|And))(\*\*)?/);
      if (keywordMatch) {
        const beforeBold = keywordMatch[1];
        const keyword = keywordMatch[2];
        const afterBold = keywordMatch[3];

        // Check if keyword is properly bolded
        const isBold = beforeBold === '**' && afterBold === '**';

        // Given, When, Then must be bold
        if (['Given', 'When', 'Then'].includes(keyword) && !isBold) {
          issues.push({
            line: lineNumber,
            rule: 'bold_keyword',
            message: `Step keyword '${keyword}' is not bold (should be **${keyword}**)`,
            text: line
          });
        }

        // And must NOT be bold
        if (keyword === 'And' && isBold) {
          issues.push({
            line: lineNumber,
            rule: 'and_not_bold',
            message: "'And' keyword should not be bold",
            text: line
          });
        }

        // Verify step is on its own line (keyword at start of line)
        if (!trimmed.startsWith('**' + keyword + '**') && !trimmed.startsWith(keyword)) {
          issues.push({
            line: lineNumber,
            rule: 'keyword_position',
            message: `Step keyword '${keyword}' must be at the beginning of the line`,
            text: line
          });
        }
      }
    }
  }

  const result = {
    valid: issues.length === 0,
    issues: issues
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// Execute validation
validateGherkin().catch(() => {
  // On error, still output valid JSON format
  const errorResult = {
    valid: false,
    issues: [{
      line: 0,
      rule: 'parse_error',
      message: 'Error reading input',
      text: ''
    }]
  };
  console.log(JSON.stringify(errorResult, null, 2));
  process.exit(0);
});
