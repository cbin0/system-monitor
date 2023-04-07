import styled, { } from 'styled-components';

export const SingleDetail = styled.div.attrs({
  className: `
    text-xl px2 flex flex-row items-stretch
  `
})(() => {
  return `
`;
});

SingleDetail.Left = styled.div.attrs((props) => {
  return {
    className: `
      basis-7em flex-shrink-0 my1 mr4 rounded-lg
      cxy-center text-stone-200
    `
  };
})(() => {
  const c = 'var(--chartBgFill)';
  return `
    background: ${c};
    box-shadow: 0 0 20px -4px ${c};
    > :nth-child(2) {
      margin: -10px 0px 0px 10px;
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
    ml-4 text-lg font-semibold font-[abeezee]
    underline decoration-2
    underline-offset-3
  `
})(() => {});

export const BulletChart = styled.div.attrs({
  className: 'h-10 mt-2'
})(() => {});
