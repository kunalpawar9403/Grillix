import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EEF4E3] flex items-center justify-center p-6 text-[#243019]">
          <div className="bg-white max-w-md w-full p-8 rounded-4xl border border-[#D0D8C2] shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center mx-auto text-2xl font-black">
              🍃
            </div>
            <h2 className="text-xl font-extrabold">Refreshing GRILLIX...</h2>
            <p className="text-xs text-[#747B68] leading-relaxed">
              We encountered a temporary module sync issue. Click below to reload fresh.
            </p>
            {this.state.error?.message && (
              <pre className="text-[10px] bg-[#EEF4E3] p-2.5 rounded-xl overflow-x-auto text-left text-red-700">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-xs shadow-md transition-all"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
