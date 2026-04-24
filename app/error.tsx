"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
      gap: "1rem",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif",
      color: "#374151",
    }}>
      <svg fill="none" height="40" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24" width="40">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Něco se pokazilo</h2>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280", textAlign: "center", maxWidth: 320 }}>
        Nastala neočekávaná chyba. Zkuste to znovu nebo obnovte stránku.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1.25rem",
          background: "#16324a",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        Zkusit znovu
      </button>
    </div>
  );
}
