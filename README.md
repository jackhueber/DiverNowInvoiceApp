# Diver Now

Admin and invoice management app for Diver Now. Includes a **mobile app** (Expo / React Native) and a **Node.js API** that uses PostgreSQL and session-based auth.

## Project structure

| Folder    | Description |
|-----------|-------------|
| `backend/` | Express API: auth, database, and business logic |
| `mobile/`  | Expo app: runs on iOS, Android, and web |

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (for the API)
- **npm** (or yarn / pnpm)

## Backend (API)

### Setup

1. Go to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` with:

   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   PORT=5000
   SESSION_SECRET=your-secret-key
   ```

   For local development with the Expo app, the default CORS settings allow `localhost:8081` and `localhost:19006`. To allow another origin, set:

   ```env
   CORS_ORIGIN=https://your-app-origin
   ```

3. Run the API. The app will create the `users` table if it does not exist:

   ```bash
   npm run dev
   ```

   The server listens on `PORT` (default 5000).

### Creating a user

From the `backend/` directory:

```bash
npm run create-user -- your@email.com yourpassword "Your Name"
```

## Mobile app

### Setup

1. Install dependencies:

   ```bash
   cd mobile
   npm install
   ```

2. (Optional) Configure the API URL. The app uses:

   - **Default:** `https://divernowinvoiceweb-production.up.railway.app`
   - **Override:** set `EXPO_PUBLIC_API_BASE_URL` in the environment or in a `.env` file, e.g. for local dev:

   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

   For a physical device, use your machine’s LAN IP (e.g. `http://192.168.1.10:5000`) instead of `localhost`.

3. Start the app:

   ```bash
   npm start
   ```

   Then:

   - Press **w** for web
   - **i** for iOS simulator
   - **a** for Android emulator  
   Or scan the QR code with the Expo Go app.

### App overview

- **Login** – Email/password; session is stored and used for API requests.
- **Dashboard** – Events and cleanings in one view.
- **Associate** – Mappings management.
- **Analytics** – Summary and charts.
- **Settings** – App settings and sign out.

## Tech stack

- **Backend:** Express, PostgreSQL (`pg`), bcrypt, express-session, CORS, cookie-parser
- **Mobile:** Expo 54, React Native, React Navigation (tabs + stack), TanStack Query, TypeScript

## License

Private project.
