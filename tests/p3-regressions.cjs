const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('[TEST] Running p3-regressions.cjs...');

// 1. Verify Gemini Model IDs across codebase
const serverGeminiPath = path.join(__dirname, '..', 'server', 'gemini.ts');
const geminiCode = fs.readFileSync(serverGeminiPath, 'utf-8');

// Ensure no deprecated/shutdown model is in source
const deprecatedMatches = geminiCode.match(/gemini-1\.5|gemini-2\.0|gemini-1\.0/g);
assert.strictEqual(deprecatedMatches, null, 'No deprecated/shutdown Gemini models allowed in server/gemini.ts');

// Ensure modern active model is present
assert.ok(geminiCode.includes('gemini-3.7-flash'), 'Active model gemini-3.7-flash must be used in server/gemini.ts');

// 2. Verify Vercel Function entrypoint exists and can be loaded
const vercelApiPath = path.join(__dirname, '..', 'api', 'index.ts');
assert.ok(fs.existsSync(vercelApiPath), 'api/index.ts must exist for Vercel deployment');

// 3. Verify vercel.json routing structure
const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf-8'));
assert.strictEqual(vercelConfig.outputDirectory, 'dist');
assert.ok(vercelConfig.functions && vercelConfig.functions['api/index.ts'], 'vercel.json must configure api/index.ts function');

// 4. Verify tsconfig.json includes and excludes
const tsconfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tsconfig.json'), 'utf-8'));
assert.ok(tsconfig.include.includes('src/**/*'), 'tsconfig must include src');
assert.ok(tsconfig.include.includes('server/**/*'), 'tsconfig must include server');
assert.ok(tsconfig.exclude.includes('SKILL EDUCATION'), 'tsconfig must exclude SKILL EDUCATION');

console.log('[PASS] p3-regressions.cjs completed successfully with 4 suites passed.');
