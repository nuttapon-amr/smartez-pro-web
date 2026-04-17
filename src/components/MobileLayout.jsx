import React from 'react';

const MobileLayout = ({ children }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '430px', 
      minHeight: '100vh',
      backgroundColor: 'white',
      position: 'relative',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
        {children}
    </div>
  );
};

export default MobileLayout;
