#!/usr/bin/env node

/**
 * Validates Gherkin-formatted acceptance criteria against the project's
 * formatting standard (see config/quality-standards.md and REFERENCE.md).
 *
 * Input:  JSON on stdin  — { "acceptance_criteria": "..." }
 * Output: JSON on stdout — { "valid": bool, "scenarios_found": n, "findings": [] }
 * Exit:   always 0 (errors are reported inside the JSON output)
 *
 * Rules checked:
 *  1. Scenario title line is fully bold and numbered: **Scenario N: Title**
 *  2. Given / When / Then keywords are bold: **Given** ...
 *  3. And keyword is NOT bold: And ...
 *  4. Every scenario contains at least Given, When, and Then
 *  5. Blank line between consecutive scenarios
 *  6. Scenario numbers are sequential starting from 1
 */

function run() {
  let raw = '';
  try {
    raw = require('fs').readFileSync('/dev/stdin', 'utf8');
  } catch (_) {
    output(false, 0, [{ type: 'error', message: 'Failed to read stdin', line: null }]);
    return;
  }

  let ac;
  try {
    const parsed = JSON.parse(raw);
    ac = parsed.acceptance_criteria;
    if (typeof ac !== 'string') throw new Error();
  } catch (_) {
    output(false, 0, [{ type: 'error', message: 'Invalid input: expected JSON with string field "acceptance_criteria"', line: null }]);
    return;
  }

  if (ac.trim() === '') {
    output(false, 0, [{ type: 'error', message: 'Acceptance criteria text is empty', line: null }]);
    return;
  }

  const lines = ac.split(/\r?\n/);
  const findings = [];
  const scenarios = []; // { startIdx, number, hasGiven, hasWhen, hasThen }

  const scenarioRe = /^\*\*Scenario\s+(\d+)\s*:\s*(.+?)\*\*$/;
  const boldKeywordRe = /^\*\*(Given|When|Then)\*\*\s/;
  const andRe = /^And\s/;
  const badBoldAndRe = /^\*\*And\*\*\s/;
  // Detect unbolded Given/When/Then (keyword at start without bold markers)
  const unboldedKeywordRe = /^(Given|When|Then)\s/;
  // Detect a scenario-like line that doesn't match the strict pattern
  const looseScenarioRe = /Scenario/i;

  let expectedNumber = 1;
  let prevScenarioIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const lineNum = i + 1;

    if (trimmed === '') continue;

    // --- Scenario title detection ---
    const scenarioMatch = trimmed.match(scenarioRe);
    if (scenarioMatch) {
      const num = parseInt(scenarioMatch[1], 10);
      const title = scenarioMatch[2].trim();

      if (!title) {
        findings.push({ type: 'error', message: `Scenario ${num} has no title after the colon`, line: lineNum });
      }

      if (num !== expectedNumber) {
        findings.push({ type: 'error', message: `Expected Scenario ${expectedNumber} but found Scenario ${num}`, line: lineNum });
      }
      expectedNumber = num + 1;

      // Blank-line check between scenarios
      if (prevScenarioIdx >= 0) {
        let hasBlank = false;
        for (let j = i - 1; j > prevScenarioIdx; j--) {
          if (lines[j].trim() === '') { hasBlank = true; break; }
        }
        if (!hasBlank) {
          findings.push({ type: 'error', message: 'Missing blank line before this scenario', line: lineNum });
        }
      }
      prevScenarioIdx = i;

      scenarios.push({ startLine: lineNum, number: num, hasGiven: false, hasWhen: false, hasThen: false });
      continue;
    }

    // Catch malformed scenario lines (looks like a scenario but wrong format)
    if (looseScenarioRe.test(trimmed) && /^\*?\*?Scenario/.test(trimmed)) {
      // Not matched by the strict regex — likely a formatting error
      // Avoid false positives on step text that happens to contain the word
      const looksLikeTitle = /^(\*{0,2})Scenario\s*\d*\s*:?/i.test(trimmed);
      if (looksLikeTitle) {
        findings.push({ type: 'error', message: 'Scenario title must be bold and numbered: **Scenario N: Title**', line: lineNum });
        scenarios.push({ startLine: lineNum, number: expectedNumber, hasGiven: false, hasWhen: false, hasThen: false });
        expectedNumber++;
        if (prevScenarioIdx >= 0) {
          let hasBlank = false;
          for (let j = i - 1; j > prevScenarioIdx; j--) {
            if (lines[j].trim() === '') { hasBlank = true; break; }
          }
          if (!hasBlank) {
            findings.push({ type: 'error', message: 'Missing blank line before this scenario', line: lineNum });
          }
        }
        prevScenarioIdx = i;
        continue;
      }
    }

    // --- Step keyword checks ---
    const current = scenarios.length > 0 ? scenarios[scenarios.length - 1] : null;

    if (boldKeywordRe.test(trimmed)) {
      const kw = trimmed.match(boldKeywordRe)[1];
      if (current) {
        if (kw === 'Given') current.hasGiven = true;
        if (kw === 'When') current.hasWhen = true;
        if (kw === 'Then') current.hasThen = true;
      }
      continue;
    }

    if (andRe.test(trimmed)) {
      // Correctly formatted And — nothing to flag
      continue;
    }

    if (badBoldAndRe.test(trimmed)) {
      findings.push({ type: 'error', message: 'And keyword must NOT be bold', line: lineNum });
      continue;
    }

    if (unboldedKeywordRe.test(trimmed)) {
      const kw = trimmed.match(unboldedKeywordRe)[1];
      findings.push({ type: 'error', message: `${kw} keyword must be bold: **${kw}**`, line: lineNum });
      if (current) {
        if (kw === 'Given') current.hasGiven = true;
        if (kw === 'When') current.hasWhen = true;
        if (kw === 'Then') current.hasThen = true;
      }
      continue;
    }

    // Line that doesn't match any known pattern — if no scenario declared yet, warn
    if (scenarios.length === 0) {
      findings.push({ type: 'warning', message: 'Content found before any scenario declaration', line: lineNum });
    }
  }

  // Validate each scenario has the required keywords
  for (const s of scenarios) {
    const missing = [];
    if (!s.hasGiven) missing.push('Given');
    if (!s.hasWhen) missing.push('When');
    if (!s.hasThen) missing.push('Then');
    if (missing.length > 0) {
      findings.push({ type: 'error', message: `Scenario ${s.number} is missing required step(s): ${missing.join(', ')}`, line: s.startLine });
    }
  }

  if (scenarios.length === 0) {
    findings.push({ type: 'error', message: 'No scenarios found in acceptance criteria', line: null });
  }

  const hasErrors = findings.some(f => f.type === 'error');
  output(!hasErrors, scenarios.length, findings);
}

function output(valid, scenariosFound, findings) {
  console.log(JSON.stringify({ valid, scenarios_found: scenariosFound, findings }, null, 2));
  process.exit(0);
}

run();
