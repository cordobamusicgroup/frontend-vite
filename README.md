# CMG Frontend App

This project is the front‑end application for **Córdoba Music Group**. It is built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) using [Vite](https://vitejs.dev/) for rapid development. The app relies on modern tools like React Router and Material UI and can be deployed to Cloudflare Workers.

## Características principales

- **React 19 + TypeScript** para una experiencia de desarrollo tipada.
- **React Router** para la navegación de la SPA.
- **Material UI** y **styled-components** para la interfaz de usuario.
- **React Query** y **Zod** para la gestión de datos y validaciones.
- Configuración de **ESLint** lista para ampliar con reglas tipadas.
- Preparado para funcionar en **Cloudflare Workers**.

## Puesta en marcha

1. Instala las dependencias con [pnpm](https://pnpm.io/):

   ```bash
   pnpm install
   ```

2. Arranca el servidor de desarrollo:

   ```bash
   pnpm run dev
   ```

3. Lanza el linter para comprobar la calidad del código:

   ```bash
   pnpm run lint
   ```

4. Genera la versión optimizada para producción:

   ```bash
   pnpm run build
   ```

5. Previsualiza la aplicación compilada:

   ```bash
   pnpm run preview
   ```

## Ampliando la configuración de ESLint

Si vas a desarrollar una aplicación para producción, recomendamos habilitar reglas sensibles al tipo:

```js
export default tseslint.config({
  extends: [
    // Sustituye ...tseslint.configs.recommended por esto
    ...tseslint.configs.recommendedTypeChecked,
    // O usa estas reglas para un nivel más estricto
    ...tseslint.configs.strictTypeChecked,
    // Opcionalmente, añade reglas de estilo
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // otras opciones...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

También puedes instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para reglas específicas de React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Añade los plugins react-x y react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // otras reglas...
    // Habilita las reglas recomendadas de typescript
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

Todo el código está protegido por la licencia incluida en este repositorio y es propiedad exclusiva de **Córdoba Music Group**.
