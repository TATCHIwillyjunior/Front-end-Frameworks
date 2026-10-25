import { Film, Star, Tags, Wifi } from "lucide-react";

interface StatsBannerProps {
  resultCount: number;
  averageRating: number;
  activeGenre: string;
  isLiveAPI: boolean;
}

export default function StatsBanner({
  resultCount,
  averageRating,
  activeGenre,
  isLiveAPI,
}: StatsBannerProps) {
  return (
    <section aria-label="Movie statistics" className="stats-banner">
      <div className="stat-card">
        <span className="stat-icon"><Film size={20} /></span>
        <span className="stat-info">
          <span className="stat-value">{resultCount}</span>
          <span className="stat-label">Movies</span>
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Star size={20} /></span>
        <span className="stat-info">
          <span className="stat-value">{averageRating.toFixed(1)}</span>
          <span className="stat-label">Average rating</span>
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Tags size={20} /></span>
        <span className="stat-info">
          <span className="stat-value">{activeGenre}</span>
          <span className="stat-label">Active genre</span>
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Wifi size={20} /></span>
        <span className="stat-info">
          <span className="stat-value">{isLiveAPI ? "Live API" : "Local data"}</span>
          <span className="stat-label">Data source</span>
        </span>
      </div>
    </section>
  );
}
