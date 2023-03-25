import React from 'react';
import { Card } from './comps';
import Settings from './settings';

export default function B() {
  return (
    <Card className="z-11 resize-none w-full flex items-center overflow-visible">
      <Settings />
    </Card>
  );
}
