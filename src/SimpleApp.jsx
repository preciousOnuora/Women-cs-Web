import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>Women@CS Website</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        If you can see this, React is working!
      </p>
      <p style={{ fontSize: '14px', color: '#999' }}>
        Environment: {process.env.NODE_ENV || 'development'}
      </p>
      <p style={{ fontSize: '12px', color: '#999' }}>
        Build successful - {new Date().toLocaleString()}
      </p>
    </div>
  );
};

export default SimpleApp;
