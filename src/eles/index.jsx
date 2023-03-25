import React from 'react';
import { Card } from './comps';
import Bar from './bar';
import Cpu from './cpu';
import Gpu from './gpu';
import CpuDetail from './cpu-detail';
import Cores from './cores';

export default function I() {
  return (
    <div className="p-[20px] flex flex-wrap gap-[20px]">
      <Bar />
      {/* TODO: read configure for width & height */}
      <Cpu className="w-[310px] h-90" />
      <Card className="w-[700px]">
        <CpuDetail />
      </Card>
      <Gpu className="w-[310px] h-90" />
      <Card className="w-full flex-shrink-0">
        <Cores />
      </Card>
    </div>
  );
}
