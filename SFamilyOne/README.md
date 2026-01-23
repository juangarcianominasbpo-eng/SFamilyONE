# SFamilyOne

Red social tipo Facebook/Instagram + Messenger (MVP) con **Supabase**, **Next.js 14**, **Vercel** y **GitHub**, lista para desplegar como **PWA** (instalable sin permisos de administrador) y con **inicio de sesión por Google y teléfono**.

> **Nota**: Este repo es un MVP funcional y extensible. Incluye: feed, perfiles con canción, posts con fotos/vídeos, likes, comentarios, follows, chat en tiempo real, subida a Storage, y PWA. Ajusta branding, moderación y términos antes de producción.

## Stack
- **Next.js 14 (App Router)** + **React** + **TypeScript**
- **Tailwind CSS** (colores llamativos por defecto)
- **Supabase**: Auth (Google + Teléfono OTP), Database (RLS), Storage, Realtime (chat, notificaciones)
- **Vercel**: Deploy

## Características
- ✅ Registro/Log-in por **Google** o **número de teléfono (OTP)**
- ✅ **Perfiles**: foto, bio, canción de perfil (autoplay con políticas de navegador, ver notas)
- ✅ **Feed** con posts (texto + imágenes/vídeos)
- ✅ **Likes**, **comentarios**, **follows**
- ✅ **Mensajes** 1 a 1 en **tiempo real**
- ✅ **Subida** de imágenes/vídeos a **Supabase Storage**
- ✅ **PWA** instalable (manifest + service worker)
- ✅ **Emojis** (nativos) y selector

## Requisitos previos
- Cuenta de **GitHub**, **Vercel**, **Supabase**

## Instalación local (opcional)
Si no puedes instalar nada en tu equipo de trabajo, puedes saltarte esto y hacer **deploy directo** (ver más abajo). Si puedes correr localmente:

```bash
pnpm i  # o npm i / yarn
pnpm dev
```

## Variables de entorno
Copia `.env.example` a `.env.local` (Vercel: añade como Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

- `NEXT_PUBLIC_SITE_URL`: tu dominio (ej. `https://sfamilyone.vercel.app`)

## Supabase: configuración
1. Crea un proyecto en Supabase y obtén `URL`, `anon key` y `service_role`.
2. En **SQL Editor**, pega `supabase/schema.sql` (tablas) y ejecuta.
3. Pega `supabase/policies.sql` (RLS) y ejecuta.
4. **Auth → Providers**: activa **Google** y configura Client ID/Secret de Google.
5. **Auth → Phone**: activa SMS (elige proveedor y claves) para OTP por teléfono.
6. **Storage**: crea bucket `media` (public read: true, upload authenticated).

## Deploy en Vercel (sin instalar nada en tu PC)
1. Sube este repo a **GitHub**.
2. En **Vercel → New Project**, importa el repo.
3. En **Environment Variables** agrega: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy. Al terminar, prueba login, posts y chat.

## Notas sobre autoplay de música de perfil
Los navegadores **bloquean** el autoplay con sonido sin interacción del usuario. Estrategia:
- Intentar reproducción al cargar si el usuario ya interactuó previamente con el sitio.
- Si falla, mostrar un botón **“▶ Reproducir”** prominente en el perfil para habilitar audio.

## Monetización (pistas)
- **Suscripciones** (Stripe) por funciones premium (temas, badges, límites superiores de subida)
- **Propinas/donaciones** a creadores (Stripe/PayPal)
- **Anuncios** (propios o red de ads), siempre cumpliendo privacidad y consentimiento

## Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Licencia / Legal
- Agrega **Términos, Privacidad y Normas** antes de invitar a usuarios reales.
- Este MVP no clona ni utiliza IP de terceros y es para uso legítimo.
