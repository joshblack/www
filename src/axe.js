import React from 'react';
import ReactDOM from 'react-dom';

export async function reportAccessibilityViolations() {
  if (process.env.NODE_ENV !== 'production') {
    const { default: axe } = await import('@axe-core/react');
    const config = {};
    axe(React, ReactDOM, 1000, config);
  }
}
