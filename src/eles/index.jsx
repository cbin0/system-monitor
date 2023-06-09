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
      <div className="order-2 flex flex-1 flex-col content-start gap-[20px]">
        {/* Settings */}
        <Bar className="" />
        <div className="flex-1 flex justify-stretch gap-[20px]">
          {/* TODO: read configure for width & height */}
          {/* CPU */}
          <Cpu className="order-2 w-[300px] min-h-110" />
          {/* CPU Detail */}
          <Card className="order-1 w-[700px] min-h-110 flex-1">
            <CpuDetail />
          </Card>
        </div>
      </div>
      {/* GPU */}
      <div className="order-1 flex">
        <Gpu className="w-[320px] min-h-90 self-stretch" />
      </div>
      {/* Cores */}
      <Card className="order-2 w-full">
        <Cores />
      </Card>
    </div>
  );
}
