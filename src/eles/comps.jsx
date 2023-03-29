import React, { useContext } from 'react';
import { Transition as HluTransition } from '@headlessui/react';
import { lighten, opacify } from 'color2k';
import styled from 'styled-components';
import { ThemeContext } from 'contexts/theme';

const Title = styled.div.attrs(() => {
  return {
    className: 'px4 pt4'
  };
})(({ brand }) => {
  const { themeVars } = useContext(ThemeContext);
  if (!brand) return null;
  const c = themeVars[`${brand}-main-color`];
  const c1 = lighten(c, 0.2);
  const c2 = lighten(c, 0.4);
  console.log(brand);
  return `
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    :after {
      content: '';
      display: block;
      height: 4px;
      margin: 1em -1em 0;
      box-shadow: 0 5px 30px ${c1}, 0 10px 40px ${c1};
      background: linear-gradient(90deg, ${c}, ${c1}, ${c2})
    }`;
});

export function Transition(props) {
  return (
    <HluTransition
      as={React.Fragment}
      {...props}
      {...{
        enter: 'transition ease-out duration-200',
        enterFrom: 'transform opacity-0 scale-95',
        enterTo: 'transform opacity-100 scale-100',
        leave: 'transition ease-in duration-150',
        leaveFrom: 'transform opacity-100 scale-100',
        leaveTo: 'transform opacity-0 scale-95'
      }}
    />
  );
}

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
