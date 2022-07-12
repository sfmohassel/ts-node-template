#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
import { join } from 'path'

// TODO update these strings when you change their correspoding files
const files = {
  '.nvmrc': 'lts/*',
  '.eslintrc': `{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "env": {
    "node": true
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "parserOptions": {
        "project": ["./tsconfig.json"]
      },
      "rules": {
        "no-unused-vars": "error",
        "no-const-assign": "error",
        "prefer-const": [
          "warn",
          {
            "destructuring": "all"
          }
        ],
        "semi": "off",
        "no-unexpected-multiline": "error",
        "no-var": "warn",
        "no-useless-constructor": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/semi": "off",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-types": [
          "error",
          {
            "types": {
              "Object": {
                "message": "Avoid using the \`Object\` type. Did you mean \`object\`?"
              },
              "Function": {
                "message": "Avoid using the \`Function\` type. Prefer a specific function type, like \`() => void\`."
              },
              "Boolean": {
                "message": "Avoid using the \`Boolean\` type. Did you mean \`boolean\`?"
              },
              "Number": {
                "message": "Avoid using the \`Number\` type. Did you mean \`number\`?"
              },
              "String": {
                "message": "Avoid using the \`String\` type. Did you mean \`string\`?"
              },
              "Symbol": {
                "message": "Avoid using the \`Symbol\` type. Did you mean \`symbol\`?"
              }
            }
          }
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "vars": "local",
            "args": "none",
            "ignoreRestSiblings": true,
            "caughtErrors": "none"
          }
        ],
        "@typescript-eslint/no-var-requires": "warn"
      }
    }
  ]
}`,
  '.eslintignore': `node_modules
dist
build`,
  '.editorconfig': `# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false`,
  '.prettierrc': `{
    "singleQuote": true,
    "trailingComma": "all",
    "semi": false,
    "tabWidth": 2,
    "endOfLine": "lf",
    "arrowParens": "always",
    "printWidth": 120
  }`,
  '.prettierignore': `# Add files here to ignore them from prettier formatting

  /dist
  /coverage`,
  'nodemon.json': `{
    "watch": ["src"],
    "ext": ".ts,.js",
    "ignore": [],
    "exec": "ts-node ./src/index.ts"
  }
`,
}

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  } catch (error) {
    console.warn(`Failed to execute ${command}`, error)
    return false
  }
}

async function install() {
  const workingDir = process.cwd()

  const commands = [
    [
      'Init',
      () => true,
      async () => {
        return runCommand('npm run init -y')
      },
    ],
    [
      'Install dependencies',
      () => true,
      async () => {
        return runCommand(
          'npm i -D @types/node typescript ts-node nodemon rimraf eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier',
        )
      },
    ],
    [
      'Install tsconfig.json',
      () => true,
      async () => {
        return runCommand(
          'npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true',
        )
      },
    ],
    [
      `Create files: ${Object.keys(files)}`,
      () => true,
      async () => {
        Object.keys(files).forEach((file) => {
          writeFileSync(join(workingDir, file), files[file])
        })
        return true
      },
    ],
    [
      'Add scripts',
      () => true,
      async () => {
        const filePath = join(workingDir, 'package.json')
        const json = JSON.parse(readFileSync(filePath, { encoding: 'utf8', flag: 'r' }))

        json.scripts = {
          build: 'rimraf ./build && tsc',
          'start:dev': 'nodemon',
          start: 'npm run build && node build/index.js',
          lint: 'eslint . --ext .ts',
          'lint:fix': 'eslint . --ext .ts --fix',
          format: "prettier --config .prettierrc 'src/**/*.ts' --write",
        }

        writeFileSync(filePath, JSON.stringify(json, null, 2))

        return true
      },
    ],
  ]

  for (let i = 0; i < commands.length; i++) {
    const [cmdDescription, canExecute, execute] = commands[i]
    if (canExecute()) {
      console.log(`${cmdDescription}...`)
      const res = await execute()
      if (res) {
        console.log('===> Successful')
      } else {
        console.warn('===> Failed')
      }
    }
  }

  console.log("Congratulations! You're typescript app is ready.")
}

await install()
