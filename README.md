# CMG Frontend App

This project is the front-end application for **Córdoba Music Group**. It is built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) using [Vite](https://vitejs.dev/) for rapid development. The app relies on modern tools like React Router and Material UI and can be deployed to Cloudflare Workers.

## Main Features

- **React 19 + TypeScript** for a fully typed development experience.
- **React Router** for SPA navigation.
- **Material UI** and **styled-components** for the user interface.
- **React Query** and **Zod** for data management and validation.
- **ESLint** configuration ready to extend with type-aware rules.
- Ready to deploy on **Cloudflare Workers**.

## Getting Started

1. Install dependencies with [pnpm](https://pnpm.io/):

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm run dev
   ```

3. Run the linter to check code quality:

   ```bash
   pnpm run lint
   ```

4. Build the optimized production version:

   ```bash
   pnpm run build
   ```

5. Preview the compiled application:

   ```bash
   pnpm run preview
   ```

## Extending ESLint Configuration

For production-grade applications, we recommend enabling type-aware rules:

```js
export default tseslint.config({
  extends: [
    // Replace ...tseslint.configs.recommended with this
    ...tseslint.configs.recommendedTypeChecked,
    // Or use these for a stricter level
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable recommended TypeScript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

---

All code is protected by the license included in this repository and is the exclusive property of **Córdoba Music Group**.
