import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from './environment';

export async function reportAccessibilityViolations() {
  if (process.env.NODE_ENV !== 'production') {
    if (canUseDOM) {
      const { default: axe } = await import('@axe-core/react');
      axe(React, ReactDOM, 1000);
    }
  }
}
