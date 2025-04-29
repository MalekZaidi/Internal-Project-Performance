import React, { useEffect, useState } from 'react';
import './LoadingPage.css'; // Make sure the CSS is correctly linked

const LoadingPage = () => {
  const [animationStart, setAnimationStart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStart(true), 200); // Delay for starting animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-container">
      <div className={`spinner ${animationStart ? 'start' : ''}`}>
        {/* Generate balls dynamically */}
        {[...Array(8)].map((_, index) => (
          <span key={index} className={`ball ball-${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
