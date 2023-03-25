import styled, { } from 'styled-components';
import { themeVarPrefix } from 'store/theme';

export const SingleDetail = styled.div.attrs({
  className: `
    text-xl
    flex flex-row items-stretch
  `
})(() => {
  return `
`;
});

SingleDetail.Left = styled.div.attrs((props) => {
  return {
    className: `
      basis-6em flex-shrink-0 mr-6 rounded-lg
      cxy-center text-stone-200
    `
  };
})(() => {
  const c = `var(--${themeVarPrefix}-chartBgFill)`;
  return `
    background: ${c};
    box-shadow: 0 0 20px -4px ${c};
    > :nth-child(2) {
      vertical-align: text-top;
      margin: -0.5em 0 0 0.5em;
    }
  `;
});

SingleDetail.Right = styled.div.attrs({
  className: 'flex-1 overflow-hidden'
})(() => {
  return `
    > :nth-child(1) {
      vertical-align: text-bottom;
      margin-right: 0.2em;
    }
`;
});

export const MoreDetail = styled.span.attrs({
  className: `
    ml-4 text-base font-semibold
    underline decoration-2
    underline-offset-2
  `
})(() => {});

export const BulletChart = styled.div.attrs({
  className: 'h-11 mt-3'
})(() => {});
