const fs = require('node:fs');
const path = require('node:path');

const manifestPath = path.resolve(__dirname, '../dist-crx/manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest file not found at ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const invalidResources = manifest.web_accessible_resources.filter(
  (resource) => resource.use_dynamic_url !== false
);

if (invalidResources.length > 0) {
  console.error(
    '❌ Validation Failed: Some web_accessible_resources have use_dynamic_url set to true.'
  );
  console.error(JSON.stringify(invalidResources, null, 2));
  process.exit(1);
} else {
  console.log(
    ' ✅ Validation Passed: All web_accessible_resources have use_dynamic_url set to false.'
  );
}
