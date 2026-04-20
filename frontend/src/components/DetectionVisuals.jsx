import React, { useState } from 'react';
import { Image as ImageIcon, FileText } from 'lucide-react';

const DetectionVisuals = ({ visuals1, visuals2, heatmap1, heatmap2 }) => {
  const [page1, setPage1] = useState(0);
  const [page2, setPage2] = useState(0);
  const [showHeatmaps, setShowHeatmaps] = useState(false);

  if (!visuals1 && !visuals2 && !heatmap1 && !heatmap2) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon className="gradient-text" /> Document Visuals
        </h3>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <input 
            type="checkbox" 
            checked={showHeatmaps} 
            onChange={(e) => setShowHeatmaps(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Show Confidence Heatmaps</span>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Handwritten Document Visuals */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>✍️ Handwritten Document</h4>
          
          {showHeatmaps && heatmap1 ? (
             <div className="text-area-box" dangerouslySetInnerHTML={{ __html: heatmap1 }} />
          ) : (
            <>
              {visuals1 && visuals1.length > 0 ? (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={`data:image/png;base64,${visuals1[page1]}`} 
                    alt="Handwritten Detection" 
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                  />
                  {visuals1.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setPage1(Math.max(0, page1 - 1))} 
                        disabled={page1 === 0}
                        className="btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                      >Prev</button>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Page {page1 + 1} of {visuals1.length}</span>
                      <button 
                        onClick={() => setPage1(Math.min(visuals1.length - 1, page1 + 1))} 
                        disabled={page1 === visuals1.length - 1}
                        className="btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                      >Next</button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  No visuals available
                </div>
              )}
            </>
          )}
        </div>

        {/* Printed Document Visuals */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>🖨️ Printed Document</h4>
          
          {showHeatmaps && heatmap2 ? (
             <div className="text-area-box" dangerouslySetInnerHTML={{ __html: heatmap2 }} />
          ) : (
            <>
              {visuals2 && visuals2.length > 0 ? (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={`data:image/png;base64,${visuals2[page2]}`} 
                    alt="Printed Detection" 
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                  />
                  {visuals2.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setPage2(Math.max(0, page2 - 1))} 
                        disabled={page2 === 0}
                        className="btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                      >Prev</button>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Page {page2 + 1} of {visuals2.length}</span>
                      <button 
                        onClick={() => setPage2(Math.min(visuals2.length - 1, page2 + 1))} 
                        disabled={page2 === visuals2.length - 1}
                        className="btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                      >Next</button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  No visuals available
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetectionVisuals;
