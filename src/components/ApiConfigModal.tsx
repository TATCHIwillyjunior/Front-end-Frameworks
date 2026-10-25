import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

interface ApiConfigModalProps {
  initialApiKey: string;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiConfigModal({
  initialApiKey,
  onClose,
  onSave,
}: ApiConfigModalProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiKey.trim()) {
      setError("Enter your TMDB API key to continue.");
      return;
    }
    onSave(apiKey.trim());
  }

  return (
    <div
      className="modal-overlay active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="api-config-title"
        aria-modal="true"
        className="modal-dialog api-config-dialog"
        role="dialog"
      >
        <button
          aria-label="Close API key settings"
          className="modal-close-btn"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
        <div className="modal-content-details">
          <h2 id="api-config-title">TMDB API key</h2>
          <p>
            Enter your TMDB v3 API key to load live movie data. Without a key,
            the app uses its included sample movies.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="tmdb-api-key">API key</label>
            <input
              autoComplete="off"
              id="tmdb-api-key"
              onChange={(event) => {
                setApiKey(event.target.value);
                setError(null);
              }}
              type="password"
              value={apiKey}
            />
            {error && <p role="alert">{error}</p>}
            <div className="modal-footer-actions">
              <button className="btn-primary" type="submit">Save key</button>
              <button className="btn-secondary" onClick={onClose} type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
