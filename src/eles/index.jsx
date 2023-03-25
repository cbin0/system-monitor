import React from 'react';
import { Card } from './comps';
import Cpu from './cpu';
import Gpu from './gpu';
import CpuDetail from './cpu-detail';
import Cores from './cores';

export default function I() {
  return (
    <div className="p-4 flex flex-wrap gap-4">
      {/* TODO: read configure for width & height */}
      <Cpu className="w-80 h-90" />
      <Card className="basis-150 flex-1">
        <CpuDetail />
      </Card>
      <Gpu className="w-80 h-90" />
      <Card className="w-full flex-shrink-0">
        <Cores />
      </Card>
    </div>
  );
}
