import React from 'react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.365 21.438c-1.353.978-2.613 1.053-3.834.02-1.254-1.077-2.735-1.025-4.143 0-1.536 1.127-2.705.996-3.824-.132C1.94 18.239-.63 12.33 1.252 7.708c.95-2.332 3.033-3.791 5.308-3.832 1.54-.027 3.018 1.047 3.824 1.047.807 0 2.585-1.282 4.41-1.096 1.86.19 3.553 1.121 4.516 2.705-3.882 2.268-3.239 7.426.544 8.932-1.182 2.92-2.502 5.06-3.489 5.974zm-2.909-17.7c-.777 2.106-2.955 3.51-4.993 3.32.483-2.148 1.95-3.826 3.864-4.524.32-.122.657-.202 1.002-.236.14.778.077 1.536-.123 2.19l.25-.75z" fill="#fff"/>
  </svg>
);

const DustParticles = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const opacity = Math.random() * 0.4 + 0.1;
    const drift = (Math.random() - 0.5) * 50;

    return (
      <div
        key={i}
        className="dust-particle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          '--particle-opacity': opacity,
          '--particle-drift': `${drift}px`
        } as React.CSSProperties}
      />
    );
  });

  return <div className="particles-container">{particles}</div>;
};

interface LandingPageProps {
  onSkipAuth: () => void;
}

export function LandingPage({ onSkipAuth }: LandingPageProps) {
  return (
    <div className="app-container">
      <DustParticles />
      <div className="content-wrapper">
        <div className="logo-container">
          <h1 className="logo-text">
            Goatin<span className="glowing-o">o</span>
          </h1>
          <div className="logo-subtitle">BY GOATHEAD</div>
        </div>

        <div className="tagline">The New Music Is Here</div>

        <div className="button-container">
          <button className="glass-button">
            <span className="button-icon">
              <GoogleIcon />
            </span>
            Continue with Google
          </button>
          
          <button className="glass-button">
            <span className="button-icon">
              <XIcon />
            </span>
            Continue with X
          </button>
          
          <button className="glass-button">
            <span className="button-icon">
              <AppleIcon />
            </span>
            Continue with Apple
          </button>
        </div>

        <div className="divider">
          <span>OTHER OPTIONS</span>
        </div>

        <div className="footer-text">
          By continuing you agree to the <a href="#" className="footer-link">Terms of Service</a>
          <br />
          and <a href="#" className="footer-link">Privacy Policy</a>
        </div>
        
        <button className="dev-skip-button" onClick={onSkipAuth}>
          Dev: Skip Auth
        </button>
      </div>
    </div>
  );
}
