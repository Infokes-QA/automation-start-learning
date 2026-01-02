const fs = require('node:fs');
const path = require('node:path');

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

function walkFiles(rootDir, predicate) {
  /** @type {string[]} */
  const results = [];
  /** @type {string[]} */
  const stack = [rootDir];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;

    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && predicate(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  results.sort((a, b) => a.localeCompare(b));
  return results;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toFeatureStepText(rawStepText) {
  // Replace Scenario Outline placeholders with cucumber-expressions.
  // E.g. "user logs in as <username>" => "user logs in as {string}" with arg name "username".
  /** @type {string[]} */
  const paramNames = [];
  const text = rawStepText.replace(/<([^>]+)>/g, (_m, name) => {
    const clean = String(name).trim();
    if (clean) paramNames.push(clean);
    return '{string}';
  });
  return { text, paramNames };
}

function extractStepsFromFeature(featureContent) {
  const content = normalizeNewlines(featureContent);
  const lines = content.split('\n');

  /** @type {{keyword: 'Given'|'When'|'Then', text: string, paramNames: string[]}[]} */
  const steps = [];

  /** @type {'Given'|'When'|'Then'} */
  let lastPrimaryKeyword = 'Given';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;

    const match = /^\s*(Given|When|Then|And|But)\s+(.*)$/.exec(line);
    if (!match) continue;

    const kw = match[1];
    const rawText = match[2].trim();

    /** @type {'Given'|'When'|'Then'} */
    let resolvedKeyword;
    if (kw === 'And' || kw === 'But') {
      resolvedKeyword = lastPrimaryKeyword;
    } else {
      resolvedKeyword = /** @type {'Given'|'When'|'Then'} */ (kw);
      lastPrimaryKeyword = resolvedKeyword;
    }

    const { text, paramNames } = toFeatureStepText(rawText);
    steps.push({ keyword: resolvedKeyword, text, paramNames });
  }

  // Deduplicate while preserving order.
  /** @type {Set<string>} */
  const seen = new Set();
  return steps.filter((s) => {
    const key = `${s.keyword}::${s.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractExistingStepTextsFromTs(tsContent) {
  const content = normalizeNewlines(tsContent);
  /** @type {Set<string>} */
  const texts = new Set();

  // Matches Given('...'), When("..."), Then(`...`) as first arg.
  // Note: this is intentionally simple and will not catch non-literal patterns.
  const re = /\b(Given|When|Then)\s*\(\s*(['"`])([\s\S]*?)\2\s*,/g;
  let m;
  while ((m = re.exec(content))) {
    const stepText = m[3];
    texts.add(stepText);
  }
  return texts;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cucumberExpressionToRegex(expr) {
  // Very small subset to reduce duplicate generation.
  // - {string} matches single/double-quoted strings
  // - {int}/{float} matches numbers
  // Everything else is treated literally.
  const escaped = escapeRegex(expr);
  const withString = escaped.replace(/\\\{string\\\}/g, "(?:'[^']*'|\"[^\"]*\")");
  const withInt = withString.replace(/\\\{int\\\}/g, '(?:-?\\d+)');
  const withFloat = withInt.replace(/\\\{float\\\}/g, '(?:-?\\d+(?:\\.\\d+)?)');
  return new RegExp(`^${withFloat}$`);
}

function hasMatchingExistingStep(featureStepText, existingStepTexts) {
  if (existingStepTexts.has(featureStepText)) return true;
  for (const existing of existingStepTexts) {
    if (!existing.includes('{')) continue;
    try {
      const re = cucumberExpressionToRegex(existing);
      if (re.test(featureStepText)) return true;
    } catch {
      // Ignore malformed patterns.
    }
  }
  return false;
}

function escapeSingleQuotes(text) {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildStepBlock(step) {
  const stepText = escapeSingleQuotes(step.text);
  const params = (step.paramNames || []).map((n, idx) => {
    const safe = String(n)
      .trim()
      .replace(/[^a-zA-Z0-9_$]/g, '_')
      .replace(/^\d/, '_$&');
    return (safe || `param${idx + 1}`) + ': string';
  });

  const args = ['{ page }'];
  if (params.length) args.push(params.join(', '));
  const signature = `async (${args.join(', ')}) =>`;

  return (
    `${step.keyword}('${stepText}', ${signature} {\n` +
    `    return 'pending';\n` +
    `});\n`
  );
}

function ensureStepsFileHeader(existingContent) {
  if (existingContent && existingContent.includes("createBdd")) return existingContent;

  const header =
    "import { createBdd } from 'playwright-bdd';\n\n" +
    'const { Given, When, Then } = createBdd();\n\n';

  if (!existingContent) return header;
  return header + existingContent.trimStart();
}

function main() {
  const workspaceRoot = process.cwd();
  const featuresDir = path.join(workspaceRoot, 'features');
  const stepsDir = path.join(workspaceRoot, 'steps');

  if (!fs.existsSync(featuresDir)) {
    console.error(`No features directory found at: ${featuresDir}`);
    process.exit(1);
  }
  ensureDir(stepsDir);

  const featureFiles = walkFiles(featuresDir, (p) => p.toLowerCase().endsWith('.feature'));
  const stepFiles = walkFiles(stepsDir, (p) => p.toLowerCase().endsWith('.ts'));

  /** @type {Set<string>} */
  const globalExistingSteps = new Set();
  for (const f of stepFiles) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const s of extractExistingStepTextsFromTs(txt)) globalExistingSteps.add(s);
  }

  let created = 0;
  let updated = 0;
  let addedSteps = 0;

  for (const featurePath of featureFiles) {
    const featureContent = fs.readFileSync(featurePath, 'utf8');
    const steps = extractStepsFromFeature(featureContent);
    if (!steps.length) continue;

    const baseName = path.basename(featurePath, '.feature');
    const outPath = path.join(stepsDir, `${baseName}.steps.ts`);

    let outContent = '';
    let existingInFile = new Set();
    if (fs.existsSync(outPath)) {
      outContent = fs.readFileSync(outPath, 'utf8');
      existingInFile = extractExistingStepTextsFromTs(outContent);
    }

    /** @type {string[]} */
    const newBlocks = [];
    for (const step of steps) {
      // Skip steps already defined anywhere to avoid ambiguous definitions.
      if (hasMatchingExistingStep(step.text, globalExistingSteps)) continue;
      if (hasMatchingExistingStep(step.text, existingInFile)) continue;
      newBlocks.push(buildStepBlock(step));
    }

    if (!newBlocks.length) continue;

    outContent = ensureStepsFileHeader(outContent);
    if (!outContent.endsWith('\n')) outContent += '\n';
    outContent += newBlocks.join('\n');

    fs.writeFileSync(outPath, outContent, 'utf8');

    if (fs.existsSync(outPath) && existingInFile.size > 0) updated++;
    else created++;

    for (const b of newBlocks) {
      // Approx count via keyword occurrences in the block.
      if (/\b(Given|When|Then)\(/.test(b)) addedSteps++;
    }
  }

  console.log(
    `generate:steps done. created=${created}, updated=${updated}, stepsAdded=${addedSteps}`
  );
}

main();
