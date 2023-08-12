module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            },
        },
    ],
    "parserOptions": {
        ecmaFeatures: {
            jsx: true
        },
        "ecmaVersion": "latest",
        "sourceType": "module",
        project: './tsconfig.json'
    },
    "plugins": [
        "react",
        'react-hooks',
        '@typescript-eslint'
    ],
    settings: {
        react: { version: 'detect' }
    },
    "rules": {
        "@typescript-eslint/semi": ['error', 'always'],
        "@typescript-eslint/space-before-function-paren": ['error', 'never'],
        "@typescript-eslint/indent": 'off',
        "no-multiple-empty-lines": ['error', {
            "max": 2,
            "maxEOF": 0,
            "maxBOF": 0,
        }],
        "@typescript-eslint/comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "never",
            "functions": "never"
        }],
        "padded-blocks": "off", // ["error", "always", { "allowSingleLineBlocks": true }],
        "quote-props": ["error", "consistent"],
        "@typescript-eslint/consistent-type-imports": ["error", {
            prefer: 'no-type-imports'
        }],
        "operator-linebreak": ["error", "before"],
        "object-shorthand": ["error", "always", {
            "avoidQuotes": true,
        }],
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },
        }]
    }
};
