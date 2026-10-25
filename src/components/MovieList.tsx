// Has the role of holding my movie list and calling it ftom the sample data file
// It hold the responsibility of also displaying my movies card in grid formate for
// easy view
import MovieCard from "./MovieCard"
import { Movie } from "../types";

export default function MovieList({
  movies,
  genres = {},
}: {
  movies: Movie[];
  genres?: Record<number, string>;
}) {


  // adult: false,
  // backdrop_path: "/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg",
  // genre_ids: [878, 28, 12],
  // id: 969681,
  // title: "Spider-Man: Brand New Day",
  // original_language: "en",
  // original_title: "Spider-Man: Brand New Day",
  // overview:
  //   "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation might also be the only thing that can stop a shocking new threat to the city and those he loves - a powerful villain no one can even see.",
  // popularity: 1146.6141,
  // poster_path: "/iPOn6DinuVyLY17YM9mKuPofV08.jpg",
  // release_date: "2026-07-29",
  // softcore: false,
  // video: false,
  // vote_average: 7.864,
  // vote_count: 1568,

  return (
    <div className="movieList">
        <section>
          <div className="movies-grid">
            {movies.length === 0 ? (
              <p>No movies found.</p>
            ) : movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genres={genres}
              />
            ))}
          </div>
        </section>
    </div>
  );
}
