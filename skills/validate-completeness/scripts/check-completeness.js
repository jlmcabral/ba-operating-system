#!/usr/bin/env node

const { stdin, stdout } = process;

// Fields excluded from validation — teams fill these during refinement
const EXCLUDED_FIELDS = ['technical_approach'];

// Default required fields when template_structure is not provided
const DEFAULT_REQUIRED_FIELDS = [
  'summary',
  'acceptance_criteria',
  'problem_statement',
];

// Values treated as effectively empty
const EMPTY_MARKERS = ['[TBD]', '[TODO]', '[MISSING]', '...'];

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' || EMPTY_MARKERS.includes(trimmed);
  }
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function errorResult(message) {
  return {
    complete: false,
    fields_checked: 0,
    missing_fields: [],
    empty_fields: [],
    findings: [],
    error: message,
  };
}

function checkCompleteness(input) {
  const issue = input.issue;
  if (!issue || typeof issue !== 'object') {
    return errorResult('Invalid input: "issue" must be an object');
  }

  const templateFields =
    input.template_structure &&
    Array.isArray(input.template_structure.required_fields)
      ? input.template_structure.required_fields
      : null;

  const requiredFields = (templateFields || DEFAULT_REQUIRED_FIELDS).filter(
    (f) => !EXCLUDED_FIELDS.includes(f)
  );

  const missingFields = [];
  const emptyFields = [];
  const findings = [];

  for (const field of requiredFields) {
    if (!(field in issue)) {
      missingFields.push(field);
      findings.push({ field, status: 'missing' });
    } else if (isEmpty(issue[field])) {
      emptyFields.push(field);
      findings.push({ field, status: 'empty' });
    } else {
      findings.push({ field, status: 'present' });
    }
  }

  return {
    complete: missingFields.length === 0 && emptyFields.length === 0,
    fields_checked: requiredFields.length,
    missing_fields: missingFields,
    empty_fields: emptyFields,
    findings,
  };
}

// --- stdin reader ---
let data = '';

stdin.on('data', (chunk) => {
  data += chunk;
});

stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    stdout.write(JSON.stringify(checkCompleteness(input)) + '\n');
  } catch (err) {
    stdout.write(JSON.stringify(errorResult('JSON parse error: ' + err.message)) + '\n');
  }
});

stdin.on('error', (err) => {
  stdout.write(JSON.stringify(errorResult('Input error: ' + err.message)) + '\n');
});
