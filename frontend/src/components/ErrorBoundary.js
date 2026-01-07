import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={styles.icon}
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div style={styles.buttonContainer}>
              <button onClick={this.handleReload} style={styles.primaryButton}>
                🔄 Refresh Page
              </button>
              <button onClick={this.handleGoHome} style={styles.secondaryButton}>
                🏠 Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
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

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    background: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '40px',
    height: '40px',
    color: '#ef4444',
  },
  title: {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '10px',
  },
  message: {
    color: '#6b7280',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondaryButton: {
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  details: {
    marginTop: '30px',
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '14px',
  },
  errorText: {
    background: '#f3f4f6',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '200px',
    marginTop: '10px',
  },
};

export default ErrorBoundary;
