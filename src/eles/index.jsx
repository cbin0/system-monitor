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
      <div className="order-1 flex flex-1 flex-wrap gap-[20px]">
        {/* TODO: read configure for width & height */}
        <Cpu className="order-2 w-[300px] h-90" />
        <Card className="order-1 w-[700px] flex-1">
          <CpuDetail />
        </Card>
        <Card className="order-3 w-full flex-shrink-0">
          <Cores />
        </Card>
      </div>
      <div className="order-2 flex">
        <Gpu className="basis-[300px] min-h-90 self-stretch" />
      </div>
    </div>
  );
}
