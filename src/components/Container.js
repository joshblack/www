import React from 'react';
import styled from '@emotion/styled';

function Container({ as = 'div', children, ...props }) {
  return React.createElement(as, props, ...children);
}

export default styled(Container)({
  width: 'var(--site-width)',
  maxWidth: 'var(--site-max-width)',
  margin: '0 auto',
  padding: '0 var(--site-padding)',
});
