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
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-8">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
            <div className="text-amber-500 text-2xl mb-4 text-center">⚠️</div>
            <h2 className="text-xl font-bold text-slate-100 mb-3 text-center">
              Something went wrong
            </h2>
            <p className="text-slate-400 text-sm mb-6 text-center">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
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
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-xs">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-400">
                  Error details
                </summary>
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