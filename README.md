# ALIVOS Web
 d
Frontend de la plataforma de cursos de ALIVOS Medicina de Rehabilitación, construido con Next.js (App Router) y Tailwind CSS. Consume la API de `alivosApi` para cursos, autenticación, dashboard de alumno y panel de administración.

## Variable de entorno

Copia `.env.local.example` a `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

En producción (Vercel), esta variable debe apuntar a la API desplegada en Render, por ejemplo:

```
NEXT_PUBLIC_API_URL=https://alivos-api.onrender.com/api
```

## Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Asegúrate de que `alivosApi` esté corriendo en `http://localhost:4000` (ver README de `alivosApi`), o el sitio caerá en los datos de referencia de `lib/mockData.ts` para no romperse.

## Cómo está conectado a la API

- `lib/api/client.ts`: cliente `fetch` con manejo de `Authorization: Bearer <token>` y errores tipados (`ApiError`).
- `lib/api/auth.ts`, `courses.ts`, `admin.ts`, `settings.ts`: funciones tipadas por dominio.
- `lib/auth/AuthContext.tsx`: sesión global (token en `localStorage`, usuario actual, `login`/`logout`).
- Cada página/componente hace su propio `fetch` en un `useEffect`, con estado de carga y, si la API no responde, cae en `lib/api/mockFallback.ts` (adaptador de `lib/mockData.ts`) para que la demo nunca se vea rota.

## Usuarios demo

| Rol   | Correo             | Contraseña     |
|-------|---------------------|----------------|
| Admin | admin@alivos.com    | Admin12345!    |
| Alumno| cliente@alivos.com  | Cliente12345!  |

En la barra de navegación, botón **Ingresar** abre un modal de login con estos dos accesos rápidos (llaman al endpoint real `POST /api/auth/login`, no están hardcodeados en el frontend).

## Estructura relevante

- `app/page.tsx`: shell de la aplicación (modo alumno/admin, navegación por vistas).
- `components/home`, `components/courses`, `components/course`, `components/dashboard`, `components/contact`: vistas públicas/alumno.
- `components/admin/*`: panel de administración (cursos, módulos/lecciones, alumnos, compras, tareas, accesos manuales, configuración).
- `public/logos/*`: logotipos de la marca.

## Deploy en Vercel

1. Importa el repo en Vercel, con **Root Directory** = `alivoweb`.
2. Agrega la variable de entorno `NEXT_PUBLIC_API_URL` apuntando a la API en Render.
3. Deploy. Build command y output quedan con los valores por defecto de Next.js (`next build`).

## Notas

- Si `NEXT_PUBLIC_API_URL` no responde, la mayoría de las pantallas públicas (inicio, catálogo de cursos) siguen mostrando contenido de referencia; las pantallas que requieren sesión (dashboard, admin) muestran un mensaje de error en vez de romperse.
- El botón "Ver como Admin/Alumno (demo)" en la barra superior (visible solo si hay sesión iniciada) permite alternar la vista sin cerrar sesión — es una ayuda para la demo, no un cambio de rol real.
