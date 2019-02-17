import React from 'react';
import { visuallyHidden } from '../tools/styles';

export default function Layout(props) {
  return (
    <React.Fragment>
      <a href="#skip-to-content" css={link}>
        Skip to content
      </a>
      {props.children}
    </React.Fragment>
  );
}

const link = {
  ...visuallyHidden,
  ':focus': {
    top: 0,
    left: 0,
    width: 'auto',
    height: 'auto',
    clip: 'auto',
    zIndex: 9999,
    backgroundColor: 'black',
    color: 'white',
    padding: '1rem 2rem',
  },
};
