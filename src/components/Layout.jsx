import React from 'react';

const Layout = ({ children, title }) => {
    return (
        <>
            {/* Background Agent Particles */}
            <div style={{ position: 'fixed', top: '50%', left: '50%', width: 0, height: 0, zIndex: 0 }}>
                {/* Orbit 1 */}
                <div className="agent-particle" style={{ width: '8px', height: '8px', animation: 'orbit1 10s linear infinite' }}></div>
                <div className="agent-particle" style={{ width: '4px', height: '4px', animation: 'orbit1 15s linear infinite reverse' }}></div>
                {/* Orbit 2 */}
                <div className="agent-particle" style={{ width: '6px', height: '6px', animation: 'orbit2 20s linear infinite' }}></div>
            </div>

            <div className="app-container" style={{ width: '100%', maxWidth: '640px', padding: '20px', position: 'relative', zIndex: 2 }}>
                <header style={{ marginBottom: '2.5rem', textAlign: 'center', animation: 'fadeIn 1.2s ease-out' }}>
                    <div className="logo-glitch-hover" style={{ display: 'inline-block', cursor: 'help' }} title="LTIMindtree Blueverse Core">
                        <img
                            src="/assets/cme_logo.png"
                            alt="CME LTIMindtree"
                            style={{ height: '60px', marginBottom: '0.8rem', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(0,212,255,0.3))', transition: 'filter 0.3s' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <img
                            src="/assets/blueverse_logo_v2.png"
                            alt="BlueVerse"
                            style={{
                                height: '55px',
                                objectFit: 'contain',
                                display: 'inline-block',
                                filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(0,212,255,0.5))',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    {title && <p style={{ color: '#8892b0', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>{title}</p>}
                </header>

                <main className="glass-panel-premium" style={{ padding: '3rem', minHeight: '480px', animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {children}
                </main>

                <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6, letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    <p>POWERED BY GEN AI · AGENTIC CORE</p>
                </footer>
            </div>
        </>
    );
};

export default Layout;
