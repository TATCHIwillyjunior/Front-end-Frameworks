import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="main-container content-page">
      <p>404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for doesn’t exist.</p>
      <button className="btn-primary" onClick={() => navigate("/")} type="button">
        Back to Home
      </button>
    </main>
  );
}
