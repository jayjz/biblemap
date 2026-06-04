"use client";
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error | null, reset: () => void) => React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);

    const errorMessage = error?.message || "";
    const isConstructorError = errorMessage.includes("is not a constructor") ||
                              errorMessage.includes("S.Ay");

    if (isConstructorError && typeof window !== "undefined") {
      const reloadCount = parseInt(sessionStorage.getItem('eb_reloadCount') || '0');

      if (reloadCount >= 3) {
        console.warn("Max reload attempts reached.");
        return;
      }

      sessionStorage.setItem('eb_reloadCount', String(reloadCount + 1));

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }

  reset = () => {
    sessionStorage.removeItem('eb_reloadCount');
    this.setState({ hasError: false, error: null });
  };

  componentDidMount() {
    if (!this.state.hasError) {
      sessionStorage.removeItem('eb_reloadCount');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      const errorMessage = this.state.error?.message || "";
      const isConstructorError = errorMessage.includes("is not a constructor") ||
                                 errorMessage.includes("S.Ay");

      const reloadCount = parseInt(sessionStorage.getItem('eb_reloadCount') || '0'); // ← Fixed scope

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-8">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
            <div className="text-amber-500 text-2xl mb-4 text-center">
              {isConstructorError ? "🔄" : "⚠️"}
            </div>
            
            <h2 className="text-xl font-bold text-slate-100 mb-3 text-center">
              {isConstructorError ? "Updating application..." : "Something went wrong"}
            </h2>
            
            <p className="text-slate-400 text-sm mb-6 text-center">
              {isConstructorError
                ? "Cache cleared — reloading with latest version..."
                : (this.state.error?.message || "An unexpected error occurred")
              }
            </p>

            {isConstructorError && reloadCount >= 3 && (
              <div className="text-center text-red-400 text-sm mt-4 mb-4">
                Still broken? Do a <strong>hard refresh</strong> (Ctrl + Shift + R) or clear site data.
              </div>
            )}

            {!isConstructorError && (
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={this.reset}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {isConstructorError && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            )}

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-xs">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-400">Error details</summary>
                <pre className="mt-2 p-3 bg-slate-950 rounded border border-slate-800 overflow-auto text-[10px] text-slate-500">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
