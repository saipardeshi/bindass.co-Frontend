# BINDASS.co — Frontend

Storefront for BINDASS, a premium unisex hoodie D2C brand. React SPA consuming the BINDASS backend API.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS** — utility-first styling
- **React Router v7** — client-side routing
- **TanStack Query (React Query)** — server-state caching for products/orders
- **Axios** — API client, with response interceptor for session expiration
- **Framer Motion** — smooth micro-interactions and transitions
- **React Hot Toast** — notifications

## Production Features

- **Auth & Password Recovery:** Full Login, Register, Forgot Password modal/view, and Password Reset page (`/reset-password/:token`) with password strength indicator.
- **Email Verification:** Complete verification banner & dedicated verification page (`/verify-email?token=...`).
- **Form Validation:** Real-time client-side validation with inline error messaging.
- **Custom 404:** Branded dark luxury 404 page (`/404` and catch-all `*`).
- **Error Tracking & Resilience:** Custom React `ErrorBoundary` and global crash reporting utility (`src/utils/errorTracker.js`).
- **Analytics Ready:** Built-in Google Analytics 4 (GA4) e-commerce event tracker (`src/utils/analytics.js`).
- **Account Management & Erasure:** Danger Zone on `/orders` with permanent account deletion confirmation.
- **Onboarding Experience:** Interactive welcome & silhouette selector modal for new members with instant coupon perks.