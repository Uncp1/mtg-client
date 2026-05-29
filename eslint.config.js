import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist', '**/node_modules', 'apps/game-standalone', 'pnpm-lock.yaml'],
  },

  // Базовые здравые правила (без типовой инфы — быстро, не бесит)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Общие пакеты игры — чистый/браузерный TS
  {
    files: ['packages/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      // any допустим, но подсвечиваем — не роняем сборку
      '@typescript-eslint/no-explicit-any': 'warn',
      // не ругаться на намеренно неиспользуемые (_arg, _unused, catch _e)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // React-слой: правила хуков только для game-ui
  {
    files: ['packages/game/game-ui/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
  },

  // ВСЕГДА последним: гасим правила, конфликтующие с Prettier
  prettier,
);
