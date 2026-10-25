# Movie App

EPITA Bachelor in Computer Science — S5
Front-End Frameworks (2627_BSI_CS_S05_PROG_FEF)

## Setup

Requirements: Node.js 18 or higher and a free TMDB account.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`. The TMDB base URL is already configured.
3. Start the app:

   ```bash
   npm run dev
   ```

4. To use live movie data, select **API Key** in the app and enter your TMDB
   **v3 API Key** (the short key, not the long API Read Access Token). The key
   is stored in this browser's local storage. Without it, the app uses local
   sample movies. A browser-stored key is visible to the client and is not a
   private production secret.

App runs at http://localhost:5173.

## Features

- Client-side routes for Home, About, and unknown-page (404) views
- Search, genre filtering, sorting, grid/list display, and favorites
- Movie details modal and runtime API-key configuration
- Local sample-data fallback when no API key has been saved
- Theme and favorites persistence in local storage

Live requests use TMDB's v3 `api_key` query parameter. Popular movies use
`/movie/popular`, searches use `/search/movie`, and genre filtering uses
`/discover/movie`. The base URL is read from `VITE_TMDB_BASE_URL` in `.env`.

## Submission secret

For GitHub Actions submissions, add the secret provided by your teacher:

- Go to **Settings → Secrets and variables → Actions → New repository secret**
- Name: `SHEETS_WEBHOOK_URL`
- Value: the URL provided via Teams -----2

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run type-check
npm run test:run
npm run test:m2
```
