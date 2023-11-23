'use client'

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { jStat } from "jstat";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { select, scaleLinear } from 'd3';
import { Rain } from "./makeItRain";
import { CisParams, Item } from "./page";

// const gamma = (n: number): number => {
//   if (n === 1) {
//     return 1;
//   } else if (n === 0.5) {
//     return Math.sqrt(Math.PI);
//   } else {
//     return (n - 1) * gamma(n - 1);
//   }
// }

const normPDF = (x: number): number => jStat.normal.pdf(x, 0, 1);
const tDistPDF = (x: number): number => jStat.studentt.pdf(x, 5);
const expPDF = (x: number): number => jStat.exponential.pdf(x, 0.5);
const ParetoPDF = (x: number): number => jStat.pareto.pdf(x, 1, 1.5);

const xMin = -4;
const xMax = 4;
const xValues = Array.from({ length: 500 }, (_, i) => {
  return (i / 500) * (xMax - xMin) + xMin;
});

export function expVal(dist_value: number) {
  let mu: number;
  if (dist_value === 1) {
    mu = 0;
  } else if (dist_value === 2) {
    mu = 0;
  } else if (dist_value === 3) {
    mu = 2;
  } else if (dist_value === 4) {
    mu = 3;
  } else {
    mu = 0;
  } 
  return mu;
}

export function Densers (x: Array<number>, dist_value: number) {
  const mu = expVal(dist_value);
  const yMin = 0;
  let yMax: number;
  if (dist_value === 1) {
    yMax = 0.8;
  } else if (dist_value === 2) {
    yMax = 0.8;
  } else if (dist_value === 3) {
    yMax = 2;
  } else if (dist_value === 4) {
    yMax = 2;
  }

 

  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([0, 500]);
  const yScale = (y: number) => ((yMax - y) / (yMax - yMin)) * 150;

  const vals = xValues.map((x) => {
      let y: number;
      if (dist_value === 1) {
        y = normPDF(x+mu);
      } else if (dist_value === 2) {
        y = tDistPDF(x+mu);
      } else if (dist_value === 3) {
        y = expPDF(x+mu);
      } else if (dist_value === 4) {
        y = ParetoPDF(x+mu);
      } else {
        y = 0;
      }
    return `${xScale(x)},${yScale(y)}`;
  }).join(' ');

  return vals;
}


export function CisTop( { lng, trans }: CisParams ) {
 
  const [dist, setDist] = useState({value:0, label: `${trans.buttonChoose}`})
  const [ssize, setSsize] = useState(32)
  const [clevel, setClevel] = useState(0.90)
  const [isSampling, setIsSampling] = useState(false)
  const [sps, setSps] = useState(1)
  const [whoChanged, setWhoChanged] = useState(0)

  const handleItemClick = (item: Item) => {
    setDist({value: item.key, label: item.label});
    setIsSampling(false);
    setWhoChanged(0);
  }

  const handleFirstSliderChange = (value: number[]) => {
    setSsize(value[0]);
    setIsSampling(false);
    setWhoChanged(0);
  }

  const handleSecondSliderChange = (value: number[]) => {
    setClevel(value[0]);
    setIsSampling(false);
    setWhoChanged(0);
  }

  const handleThirdSliderChange = (value: number[]) => {
    setSps(value[0]);
    setIsSampling(false);
    setWhoChanged(2);
  }
  const handleSamplingToggle = () => {
    if (dist.value !== 0) {
      setIsSampling(isSampling => !isSampling);
      setWhoChanged(1);
    }
  };

  const points = Densers(xValues, dist.value);
  
  const rainRef = useRef<SVGSVGElement | null>(null);
  const graphRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const SVG = select(rainRef.current).node() as SVGSVGElement;
    const gSVG = select(graphRef.current).node() as SVGSVGElement;
    
    Rain({
      SVG,
      gSVG,
      distribution: dist.value,
      sampleSize: ssize,
      confidenceLevel: clevel,
      drawing: isSampling,
      sps: sps,
      whoChanged: whoChanged,
    });

  }, [isSampling, dist.value, ssize, clevel, sps, whoChanged]);

  return (
    <MathJaxContext>
    <div className="grid grid-cols-5">
      <div className="bg-gray-200 p-4 col-span-2">
        <div className="mb-12">
        <p className="text-3xl">
          <Link href={`/${lng}/confint/one/context`} className="text-blue-500 hover:text-blue-600">
          {`${trans.leftTitle}`}
          </Link>
        </p>
        <br />
        <p>
          {`${trans.blob}`}
        </p>
        <br />
        <p className="mb-6">
          {`${trans.chooseDist}`}
        </p>
        <br />
        <Dropdown placement="right">
      <DropdownTrigger>
        <Button 
          variant="shadow"
          color="secondary"
        >
          {dist.label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={trans.choiceDist}>
        {(item: object) => (
          <DropdownItem
            key={(item as Item).key}
            onClick={() => handleItemClick(item as Item)}
          >
            {(item as Item).label}
          </DropdownItem>
        )}
      </DropdownMenu>
      </Dropdown>
      </div>
      <p className="flex flex-wrap mb-10">
        {`${trans.chooseSize}`}<MathJax>{"\\( \\ \( n \) \\ \\)"}</MathJax>
        {`${trans.chooseLevel}`}<MathJax>{"\\( \\ 1 - \\alpha \\ .\\)"}</MathJax>
      </p>
      <p className="flex flex-wrap mb-10">
        <MathJax>{"\\( n = \\ \\)"}</MathJax>
        {ssize}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Slider 
          defaultValue={[32]}
          min={30} 
          max={50} 
          step={1}
          className={cn("w-[60%]")}
          onValueChange={handleFirstSliderChange}
        />
      </p>
      <p className="flex flex-wrap mb-10">
        <MathJax>{"\\( 1 - \\alpha = \\ \\)"}</MathJax>
        {clevel}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Slider 
          defaultValue={[0.90]}
          min={0.05} 
          max={0.99} 
          step={0.01}
          className={cn("w-[60%]")}
          onValueChange={handleSecondSliderChange}
        />
      </p>
      <p className="mb-6"> 
        {`${trans.graphTitle}`}
      </p>

      <svg ref={graphRef} viewBox={`0 0 250 100`} width="80%" className="mx-auto">
      </svg>
    </div>

    <div className="bg-gray-100 p-4 col-span-3">
        <svg ref={rainRef} viewBox={`0 0 500 350`} width="100%">
          <text
            fill="black"
            transform={`translate(20, 20)`}
          >
            {`${trans.rightTitle}`}
          </text>
          <line
            x1="0"
            y1="150"
            x2="500"
            y2="150"
            stroke="black"
            strokeWidth="1"
          />
          <text x="0" y="158" fontSize="6">
            {`${trans.density}`}
          </text>
          <line
            x1="0"
            y1="250"
            x2="500"
            y2="250"
            stroke="black"
            strokeWidth="1"
          />
          <text x="0" y="258" fontSize="6">
            {`${trans.estimate}`}
          </text>

          {dist.value !== 0 ? (
            <>

            <path d={`M ${points}`} fill="yellow" stroke="orange" strokeWidth="2" />  
            </>
          ) : null}

          <line
              x1="250"
              y1="50"
              x2="250"
              y2="350"
              stroke="black"
              strokeWidth="1"
              strokeDasharray="5"
          />
          <text x="250" y="40" fontSize="10" textAnchor="middle">
            μ
          </text> 
        </svg>
        <div className="grid grid-cols-5">
        <Button variant="shadow" color="secondary" onClick={handleSamplingToggle}>
          {isSampling ? `${trans.stopSampling}` : `${trans.startSampling}`}
        </Button>
        <div className="cols-span-3 ml-auto">
        <p className="mr-2">
          {`${trans.samplingSpeed}: ${sps}`}
        </p>
        <Slider 
          defaultValue={[1]}
          min={0.5} 
          max={5} 
          step={0.5}
          className={cn("w-[80%]")}
          onValueChange={handleThirdSliderChange}
        />
        </div>
        </div>
      </div>
    </div>
    </MathJaxContext>
  )
}