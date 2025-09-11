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
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => {
            fetch('/api/status')
              .then(res => res.json())
              .then(data => alert(JSON.stringify(data, null, 2)))
              .catch(err => alert('API Error: ' + err.message));
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test API
        </button>
      </div>
    </div>
  );
};

export default SimpleApp;
