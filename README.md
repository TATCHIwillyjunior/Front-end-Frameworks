# CineGrid Movie App

CineGrid is a single-page movie browser built for the EPITA Bachelor in
Computer Science, Semester 5 course **Front-End Frameworks**
(`2627_BSI_CS_S05_PROG_FEF`). Browse movie information, search and filter the
catalogue, view movie details, and keep a personal watchlist.

Movie data can come from [The Movie Database (TMDB)](https://www.themoviedb.org/)
or from the sample data included in this repository.

## Contents

- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Configure live TMDB data](#configure-live-tmdb-data)
- [Use the app](#use-the-app)
- [Routes](#routes)
- [Saved data and privacy](#saved-data-and-privacy)
- [Project structure](#project-structure)
- [Available commands](#available-commands)
- [Course submission workflow](#course-submission-workflow)

## Requirements

- Node.js 18 or later
- npm (included with Node.js)
- A TMDB account and v3 API key to load live movie data; the key is optional
  because the app includes sample movies

## Run locally

1. Open a terminal in the project directory.
2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`. For example:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env`.

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal. By default it is
   `http://localhost:5173`.

The app starts in sample-data mode until a TMDB key is saved in the app. If you
change `.env`, restart the development server so Vite can reload the
configuration.

## Configure live TMDB data

The `.env.example` file configures the TMDB API base URL:

```dotenv
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

To enable live movie data:

1. Create a TMDB account and obtain a **v3 API Key** from your TMDB account
   settings.
2. In CineGrid, select **API Key** in the header.
3. Enter the v3 API key (not the longer API Read Access Token) and select
   **Save key**.

The key is saved in this browser's local storage and sent to TMDB as the
`api_key` query parameter. Do not put a private production credential in a
Vite `VITE_` environment variable: values with this prefix are exposed to
client-side code. The key entered in the app is also accessible to the
browser, so use it only for this client-side course project.

When a key is configured, CineGrid uses TMDB's popular-movies endpoint for the
default catalogue, its search endpoint for title searches, and its discover
endpoint for genre-filtered browsing. The genre list is loaded from TMDB as
well. Network or API errors are displayed in the app.

If no key is configured, CineGrid uses the included sample movie and genre
data. Search, genre filtering, and sorting are still available in this mode.
The watchlist is stored locally and does not require a TMDB key.

## Use the app

- **Browse:** The Home page shows the current movie results and a summary of
  the result count and average rating.
- **Search:** Enter a movie title in the header search field. Select its clear
  button to remove the search.
- **Filter by genre:** Choose a genre filter above the results, or choose
  **All** to remove the genre filter.
- **Sort:** Sort results by popularity, rating, release date, or title.
- **Change layout:** Choose grid or list view using the view controls.
- **View details:** Select a movie card to open its details modal. Close the
  modal using its close button or by selecting the backdrop.
- **Manage your watchlist:** Select the heart on a card or the watchlist
  control in the details modal. The Favorites button in the header shows the
  current count and toggles the results to show saved movies only. Favorite
  changes made in either place are reflected throughout the app.
- **Change appearance:** Use the theme control in the header to switch between
  dark and light themes.
- **Read about the app:** Select **About** in the navigation. Unknown paths
  show the not-found page, which links back to the app.

## Routes

| Path | Page |
| --- | --- |
| `/` | Movie browser |
| `/about` | About CineGrid |
| Any other path | Not-found page |

## Saved data and privacy

CineGrid saves these values in the browser's local storage:

| Data | Storage key | Purpose |
| --- | --- | --- |
| TMDB v3 API key | `cinegrid_api_key` | Enables requests to TMDB |
| Watchlist movies | `cinegrid_favorites` | Retains saved movies and their details |
| Theme | `cinegrid_theme` | Remembers the selected dark or light theme |

Saved data is local to the current browser profile. It is not synchronized
between devices or browsers. Clearing this site's browser storage removes the
saved key, watchlist, and theme preference.

## Project structure

```text
src/
  components/   Reusable UI: header, filters, movie cards, and modals
  context/      Shared app state for theme and watchlist
  data/         Included sample movies and fallback genres
  hooks/        Movie and genre loading hooks
  pages/        Home, About, and not-found pages
  services/     TMDB requests and local-storage helpers
  test/         Vitest and React Testing Library tests
  App.tsx       App-wide state provider and route definitions
  main.tsx      React application entry point
```

The app uses React 18, TypeScript, Vite, React Router, Vitest, and
React Testing Library.

## Available commands

Run these commands from the project directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint on the TypeScript and TSX files |
| `npm run type-check` | Run TypeScript checking without emitting files |
| `npm test` | Start Vitest in watch mode |
| `npm run test:run` | Run the complete Vitest suite once |
| `npm run test:run:verbose` | Run the complete Vitest suite with verbose output |
| `npm run test:m1` | Run the Milestone 1 test file |
| `npm run test:m2` | Run the Milestone 2 test file |
| `npm run test:m3` | Run the Milestone 3 test file |

## Course submission workflow

If the course GitHub Actions workflow requires the submission webhook, add the
URL provided by your instructor as a repository Actions secret:

1. Open the repository's **Settings → Secrets and variables → Actions**.
2. Create a repository secret named `SHEETS_WEBHOOK_URL`.
3. Set its value to the webhook URL provided for the course.

Do not add the webhook URL to source files or commit it to the repository.
