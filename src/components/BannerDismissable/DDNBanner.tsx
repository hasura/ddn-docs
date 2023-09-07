import React, { useState } from 'react';
import './DDNBanner.css';

export const DDNBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="banner">
      This the documentation for Hasura DDN, the future of data delivery.&nbsp;<a href="https://hasura.io/docs/latest/index/">Click here for the Hasura v2.x docs </a>.
      <button className="close-btn" onClick={() => setIsVisible(false)}>x</button>
    </div>
  );
}