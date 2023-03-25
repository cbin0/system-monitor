import React, { useContext } from 'react';
import { lighten, darken } from 'polished';
import styled from 'styled-components';
import { ThemeContext } from 'contexts/theme';

const Title = styled.div.attrs(() => {
})(({ brand }) => {
  const { themeVars } = useContext(ThemeContext);
  const c = themeVars[`${brand}-main-color`];
  console.log(brand);
  return brand && `
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 1em 1em 0;
    :after {
      content: '';
      display: block;
      height: 4px;
      margin: 1em -1em 0;
      box-shadow: 0 8px 30px ${lighten(0.2, c)}, 0 4px 20px ${lighten(0.2, c)};
      background: linear-gradient(90deg, ${c}, ${lighten(0.2, c)}, ${lighten(0.4, c)})
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
