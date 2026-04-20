import React, { useEffect, useRef } from 'react';
import { Activity, CheckCircle, AlertTriangle, AlertCircle, Terminal } from 'lucide-react';

const LOG_COLORS = {
  INFO: '#58a6ff',
  SUCCESS: '#5cfcb4',
  WARN: '#fcbc5c',
  ERROR: '#fc5c7c',
  DEBUG: '#6a6a80',
};

const getIcon = (level) => {
  switch (level) {
    case 'INFO': return <Activity size={14} color={LOG_COLORS.INFO} />;
    case 'SUCCESS': return <CheckCircle size={14} color={LOG_COLORS.SUCCESS} />;
    case 'WARN': return <AlertTriangle size={14} color={LOG_COLORS.WARN} />;
    case 'ERROR': return <AlertCircle size={14} color={LOG_COLORS.ERROR} />;
    default: return <Terminal size={14} color={LOG_COLORS.DEBUG} />;
  }
};

const LiveTerminal = ({ logs, elapsedTime, status }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginTop: '2rem' }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '0.8rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fc5c7c' }}></div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fcbc5c' }}></div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5cfcb4' }}></div>
          <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            Extraction Console
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--accent-primary)' }}>
            ⏱️ {elapsedTime.toFixed(1)}s
          </span>
          {status === 'processing' && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div>}
        </div>
      </div>
      
      <div style={{
        background: '#1a1a24',
        padding: '1rem',
        height: '300px',
        overflowY: 'auto',
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }}>
        {logs.length === 0 && status !== 'processing' ? (
          <div style={{ color: '#6a6a80', textAlign: 'center', marginTop: '5rem' }}>
            Ready to extract...
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.3rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#6a6a80', flexShrink: 0 }}>{log.timestamp}</span>
              <span style={{ 
                color: LOG_COLORS[log.level] || LOG_COLORS.DEBUG, 
                fontWeight: 600, 
                width: '70px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {/*getIcon(log.level)*/}
                [{log.level}]
              </span>
              <span style={{ color: '#e8e8f0', wordBreak: 'break-word' }}>{log.message}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default LiveTerminal;
