# 📁 Estructura del Proyecto (Vite + React)

Este documento describe la estructura del proyecto en **Vite + React**, utilizando **modularización por funcionalidad** para mantener el código organizado y escalable.

## 📂 Estructura General

```
📦 src
 ┣ 📂 modules                # 🔥 Módulos específicos por funcionalidad
 ┃ ┣ 📂 auth                 # Autenticación (Login, Registro, etc.)
 ┃ ┃ ┣ 📂 components         # Componentes relacionados con auth
 ┃ ┃ ┣ 📂 hooks              # Hooks relacionados con auth
 ┃ ┃ ┣ 📂 services           # Servicios/API calls de auth
 ┃ ┃ ┗ 📜 index.ts           # Barrel file (exporta todo el módulo)
 ┃ ┣ 📂 admin                # Funcionalidades de administrador
 ┃ ┣ 📂 users                # Funcionalidades de usuarios
 ┃ ┗ 📂 reports              # Funcionalidades de reportes
 ┣ 📂 hooks                  # Hooks globales reutilizables (no de un módulo específico)
 ┃ ┣ 📜 useTheme.ts          # Hook de tema global
 ┃ ┣ 📜 useAuth.ts           # Hook de autenticación (si es global)
 ┃ ┗ 📜 useFetch.ts          # Hook genérico para fetch API
 ┣ 📂 context                # Contextos globales de la app
 ┃ ┣ 📜 AuthContext.tsx      # Contexto de autenticación
 ┃ ┣ 📜 ThemeContext.tsx     # Contexto de tema
 ┃ ┗ 📜 UserContext.tsx      # Contexto de usuario
 ┣ 📂 components             # Componentes genéricos reutilizables
 ┃ ┣ 📂 ui                   # Componentes visuales reutilizables (botones, inputs, modales)
 ┃ ┣ 📂 layouts              # Diseños generales (Navbar, Sidebar, DashboardLayout)
 ┃ ┗ 📜 index.ts             # Barrel file para exportar todos los componentes
 ┣ 📂 pages                  # Rutas principales de la aplicación
 ┃ ┣ 📂 auth                 # Páginas de autenticación
 ┃ ┃ ┣ 📜 Login.tsx          # Página de login
 ┃ ┃ ┣ 📜 Register.tsx       # Página de registro
 ┃ ┗ 📂 admin                # Páginas de administración
 ┃   ┗ 📜 Dashboard.tsx      # Dashboard de admin
 ┣ 📂 services               # Peticiones API centralizadas
 ┃ ┣ 📜 api.ts               # Configuración de Axios / Fetch API
 ┃ ┣ 📜 authService.ts       # Servicio para login, register, logout
 ┃ ┗ 📜 userService.ts       # Servicio para obtener datos de usuario
 ┣ 📂 utils                  # Funciones utilitarias globales
 ┃ ┣ 📜 formatDate.ts        # Formateo de fechas
 ┃ ┣ 📜 helpers.ts           # Funciones helpers generales
 ┃ ┗ 📜 constants.ts         # Constantes globales (roles, rutas, etc.)
 ┣ 📜 App.tsx                # Entrada principal de la app
 ┣ 📜 main.tsx               # Punto de montaje con ReactDOM
 ┗ 📜 vite.config.ts         # Configuración de Vite
```

---

## 📌 Descripción de Carpetas

### 📂 `modules/`

Cada funcionalidad tiene su propio módulo con:

- **`components/`**: Componentes específicos de esa funcionalidad.
- **`hooks/`**: Hooks relacionados con esa funcionalidad.
- **`services/`**: Llamadas a API específicas de ese módulo.
- **`index.ts`**: Archivo que exporta todo el módulo (barrel file).

Ejemplo: `modules/auth` maneja autenticación y contiene sus propios componentes, hooks y servicios.

### 📂 `hooks/`

Contiene **hooks reutilizables** en toda la aplicación, como:

- `useTheme.ts`: Manejo del tema global.
- `useAuth.ts`: Manejo de la autenticación.
- `useFetch.ts`: Fetch genérico para llamadas API.

### 📂 `context/`

Almacena **contextos globales** usando React Context API, como:

- `AuthContext.tsx`: Contexto de autenticación.
- `ThemeContext.tsx`: Contexto de tema.
- `UserContext.tsx`: Contexto de usuario.

### 📂 `components/`

Guarda **componentes reutilizables**, divididos en:

- **`ui/`**: Botones, modales, inputs.
- **`layouts/`**: Navbar, Sidebar, DashboardLayout.
- `index.ts`: Barrel file para importar/exportar fácilmente.

### 📂 `pages/`

Almacena las **rutas principales**, organizadas por sección:

- `auth/`: `Login.tsx`, `Register.tsx`.
- `admin/`: `Dashboard.tsx`.

### 📂 `services/`

Manejo centralizado de llamadas API con Axios o Fetch:

- `authService.ts`: Login/Register.
- `userService.ts`: Obtención de usuarios.
- `api.ts`: Configuración de la API.

### 📂 `utils/`

Funciones utilitarias como:

- `formatDate.ts`: Formateo de fechas.
- `helpers.ts`: Funciones helper.
- `constants.ts`: Constantes globales (roles, rutas, etc.).

---

## 🎯 Beneficios de esta Estructura

✅ **Escalable**: Puedes agregar más módulos sin desordenar el código.  
✅ **Mantenible**: Todo está bien separado, facilitando depuración.  
✅ **Reutilizable**: Hooks y componentes se pueden compartir entre módulos.  
✅ **Modular**: Facilita extraer módulos para micro-frontends en el futuro.

---

## 🚀 ¿Cómo usar esta estructura?

1. **Crea un nuevo módulo en `modules/` cuando agregues nuevas funcionalidades.**
2. **Si un hook es solo para un módulo, colócalo dentro de `modules/nombreModulo/hooks/`.**
3. **Si un hook es global, ponlo en `hooks/`.**
4. **Centraliza llamadas a la API en `services/`.**
5. **Usa `context/` para manejar estado global (como auth, usuario, tema).**

---

📌 **Siguiendo esta estructura, el código será más ordenado, fácil de escalar y mantener.** 🚀🔥
