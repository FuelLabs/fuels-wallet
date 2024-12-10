{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": {
          "level": "warn"
        }
      },
      "style": {
        "noNonNullAssertion": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  },
  "json": {
    "parser": {
      "allowTrailingCommas": true
    }
  },
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignore": [
      ".changeset",
      ".vscode",
      "**/scripts",
      "**/node_modules",
      "**/.turbo",
      "**/build",
      "**/dist",
      "**/dist-crx",
      "**/contracts/**",
      "**/playwright-report",
      "**/vite-*.d.ts",
      "pnpm-lock.yaml"
    ]
  }
}
