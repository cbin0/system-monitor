import React, { useContext } from 'react';
import { lighten, opacify } from 'polished';
import styled from 'styled-components';
import { ThemeContext } from 'contexts/theme';

const Title = styled.div.attrs(() => {
})(({ brand }) => {
  if (!brand) return null;
  const { themeVars } = useContext(ThemeContext);
  const c = themeVars[`${brand}-main-color`];
  const c1 = lighten(0.2, c);
  const c2 = lighten(0.4, c);
  console.log(brand);
  return `
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 1em 1em 0;
    :after {
      content: '';
      display: block;
      height: 4px;
      margin: 1em -1em 0;
      box-shadow: 0 5px 30px ${c1}, 0 10px 40px ${c1};
      background: linear-gradient(90deg, ${c}, ${c1}, ${c2})
    }`;
});

export function Card({ className, children }) {
  const { themeVars } = useContext(ThemeContext);
  return (
    <div className={`${className || ''} card ${themeVars.cardBg}`}>
      {children}
    </div>
  );
}

Card.Title = function T({ brand, children, className }) {
  const { themeVars } = useContext(ThemeContext);
  return (
    <Title brand={brand} className={`${className || ''} ${themeVars.cardTitleBg}`}>
      {children}
    </Title>
  );
};

Card.Body = function B({ children, className }) {
  return (
    <div className={`${className || ''} relative rounded-b-inherit flex-1`}>
      {children}
    </div>
  );
};
