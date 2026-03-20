import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh", background: "#0a0f1e", color: "#e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: "2rem",
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 1.5rem",
          }}>💥</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{
              background: "#4f51ea", color: "white", border: "none",
              padding: "0.75rem 2rem", borderRadius: 12,
              fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Reload App
          </button>
          <details style={{ marginTop: "1.5rem", textAlign: "left" }}>
            <summary style={{ color: "#475569", fontSize: "0.75rem", cursor: "pointer" }}>Error details</summary>
            <pre style={{
              marginTop: "0.5rem", padding: "1rem", borderRadius: 8,
              background: "#0f172a", color: "#94a3b8",
              fontSize: "0.7rem", overflow: "auto", whiteSpace: "pre-wrap",
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
