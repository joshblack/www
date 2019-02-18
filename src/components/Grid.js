import styled from '@emotion/styled';
import Main from './Main';

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'auto',
  gridGap: '0 16px',
  paddingRight: '1rem',
  paddingLeft: '1rem',
  width: '100%',
  maxWidth: '60rem',
  margin: '0 auto',
};

export const Grid = styled('div')(grid);
export const GridHeader = Grid.withComponent('header');
export const GridMain = Grid.withComponent(Main);
export const GridFooter = Grid.withComponent('footer');
