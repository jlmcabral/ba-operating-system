#!/usr/bin/env node

const { stdin, stdout } = process;

// Define required fields by issue type
const REQUIRED_FIELDS = {
  ALL: ['summary', 'acceptance_criteria'],
  STORY: ['problem_statement', 'persona', 'candidate_story'],
  BUG: ['problem_statement', 'persona'],
};

// Placeholders that count as missing
const PLACEHOLDERS = ['[TBD]', '[TODO]', '...'];

/**
 * Check if a field value is missing
 */
function isMissing(value) {
  if (value === null || value === undefined) return true;
  if (value === '[MISSING]') return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Check if a field has unresolved inference
 */
function hasInference(value) {
  if (typeof value === 'string') {
    return value.includes('[INFERRED]');
  }
  return false;
}

/**
 * Check if a field is a placeholder
 */
function isPlaceholder(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return PLACEHOLDERS.includes(trimmed);
  }
  return false;
}

/**
 * Get all required fields for an issue type
 */
function getRequiredFields(issueType) {
  const required = [...REQUIRED_FIELDS.ALL];
  
  if (issueType === 'Story') {
    required.push(...REQUIRED_FIELDS.STORY);
  } else if (issueType === 'Bug') {
    required.push(...REQUIRED_FIELDS.BUG);
  }
  
  return required;
}

/**
 * Check completeness of canonical issue
 */
function checkCompleteness(input) {
  try {
    const { canonical_issue, issue_type } = input;
    
    if (!canonical_issue || typeof canonical_issue !== 'object') {
      return {
        error: 'Invalid input: canonical_issue must be an object',
        complete: false,
        missing_fields: [],
        inferred_fields: [],
        placeholder_fields: [],
        severity: null,
      };
    }
    
    if (!issue_type || typeof issue_type !== 'string') {
      return {
        error: 'Invalid input: issue_type must be a non-empty string',
        complete: false,
        missing_fields: [],
        inferred_fields: [],
        placeholder_fields: [],
        severity: null,
      };
    }
    
    const requiredFields = getRequiredFields(issue_type);
    const missingFields = [];
    const inferredFields = [];
    const placeholderFields = [];
    
    // Check each required field
    for (const field of requiredFields) {
      const value = canonical_issue[field];
      
      // Never flag technical_approach as missing
      if (field === 'technical_approach') {
        continue;
      }
      
      if (isMissing(value)) {
        missingFields.push(field);
      } else if (hasInference(value)) {
        inferredFields.push(field);
      } else if (isPlaceholder(value)) {
        placeholderFields.push(field);
      }
    }
    
    // Determine severity
    let severity = null;
    if (missingFields.length > 0) {
      severity = 'critical';
    } else if (inferredFields.length > 0 || placeholderFields.length > 0) {
      severity = 'minor';
    }
    
    const complete = missingFields.length === 0 && 
                     inferredFields.length === 0 && 
                     placeholderFields.length === 0;
    
    return {
      complete,
      missing_fields: missingFields,
      inferred_fields: inferredFields,
      placeholder_fields: placeholderFields,
      severity,
    };
  } catch (error) {
    return {
      error: `Validation error: ${error.message}`,
      complete: false,
      missing_fields: [],
      inferred_fields: [],
      placeholder_fields: [],
      severity: null,
    };
  }
}

// Read from stdin
let data = '';

stdin.on('data', chunk => {
  data += chunk;
});

stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const result = checkCompleteness(input);
    stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    const errorResult = {
      error: `JSON parse error: ${error.message}`,
      complete: false,
      missing_fields: [],
      inferred_fields: [],
      placeholder_fields: [],
      severity: null,
    };
    stdout.write(JSON.stringify(errorResult) + '\n');
  }
});

stdin.on('error', (error) => {
  const errorResult = {
    error: `Input error: ${error.message}`,
    complete: false,
    missing_fields: [],
    inferred_fields: [],
    placeholder_fields: [],
    severity: null,
  };
  stdout.write(JSON.stringify(errorResult) + '\n');
});
