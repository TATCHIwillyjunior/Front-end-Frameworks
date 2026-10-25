import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="main-container content-page">
      <h1>About CineGrid</h1>
      <p>
        CineGrid helps you explore popular movies, search titles, filter by
        genre, and keep a personal favorites list.
      </p>
      <p>
        Movie information is provided by TMDB. Add your own TMDB v3 API key in
        the app settings to use live data, or browse the included sample data.
      </p>
      <Link className="btn-primary" to="/">Back to movies</Link>
    </main>
  );
}
