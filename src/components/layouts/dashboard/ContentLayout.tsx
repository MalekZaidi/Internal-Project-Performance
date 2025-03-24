import React from 'react';

type ContentLayoutProps = {
  children: React.ReactNode;
};

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '16px',
        boxSizing: 'border-box', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      {children}
    </div>
  );
};