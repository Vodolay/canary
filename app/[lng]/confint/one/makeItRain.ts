'use client'

import * as d3 from "d3";
import { jStat } from "jstat";
import { expVal } from "./cisTop";

// type SvgInHtml = HTMLElement & SVGElement;

interface StartSampling {
  SVG: SVGSVGElement;
  gSVG: SVGSVGElement;
  distribution: number;
  sampleSize: number;
  confidenceLevel: number;
  drawing?: boolean;
  sps?: number;
  whoChanged?: number;
}


function drawSelected(n: number, distribution: number) {
  let mu = expVal(distribution);
  let tmp = [];
  if (distribution === 1) {
    for(let i = 0; i < n; i++) {
      tmp[i] = jStat.normal.sample(0, 1) - mu;
    } 
  } else if (distribution === 2) {
      for(let i = 0; i < n; i++) {
        tmp[i] = jStat.studentt.sample(5) - mu;
    }
  } else if (distribution === 3) {
      for(let i = 0; i < n; i++) {
        tmp[i] = jStat.exponential.sample(0.5) - mu;
    }
  } else if (distribution === 4) {
      let unif = 0.5;
      for(let i = 0; i < n; i++) {
        unif = jStat.uniform.sample(0, 1);
        tmp[i] = jStat.pareto.inv(unif, 1, 1.5) - mu;
    } 
  }
  return tmp;
}

// This should be the same linear scale as in cisTop.ts
const linearScale = d3.scaleLinear()
  .domain([-4, 4])
  .range([0, 500]);

export let samples = 0;
export let goodSamples = 0;

function makeItRain (
  { SVG,
    gSVG,
    distribution,
    sampleSize,
    confidenceLevel, 
    sps
  }: StartSampling
) {
  const fps = sps ?? 1;
  const svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(SVG);
  const gsvg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(gSVG);

  samples += 1;
  let points = drawSelected(sampleSize, distribution);
  let mean = jStat.mean(points);
  let ci = jStat.normalci(mean, 1-confidenceLevel, points);
  let zeroInRange = ci[0] <= 0 && ci[1] >= 0;

  if (zeroInRange) {
    goodSamples += 1;
  }

  console.log("samples: ", samples, "goodSamples: ", goodSamples);

  svg.selectAll("circle")
    .data(points ?? [])
    .enter()
    .append("circle")
    .attr("cx", (d) => linearScale(d))
    .attr("cy", 150)
    .attr("r", 4)
    .style("fill", "green")
    .transition()
    .duration(450/fps) // adjust duration as needed
    .attr("cy", 250)
    .transition()
    .duration(50/fps)
    .attr("cx", linearScale(mean))
    .transition()
    .duration(450/fps)
    .style("opacity", 0)
    .remove();

  svg.selectAll(".tick")
    .data([mean, ci[0], ci[1]])
    .enter()
    .append("line")
    .attr("class", "tick")
    .attr("x1", d => linearScale(d))
    .attr("x2", d => linearScale(d))
    .attr("y1", d => 250 - 2)
    .attr("y2", d => 250 + 2)
    .attr("stroke", zeroInRange ? "blue" : "red")
    .attr("stroke-width", 2)
    .style("opacity", 0)
    .transition()
    .delay(400/fps)
    .duration(100/fps)
    .style("opacity", 1)
    .transition()
    .duration(450/fps)
    .attr("y1", d => 350 - 2)
    .attr("y2", d => 350 + 2)
    .remove()
  
  svg.selectAll(".ci-line")
    .data([ci])
    .enter()
    .append("line")
    .attr("class", "ci-line")
    .attr("x1", linearScale(ci[0]))
    .attr("x2", linearScale(ci[1]))
    .attr("y1", 250)
    .attr("y2", 250)
    .attr("stroke", zeroInRange ? "blue" : "red")
    .attr("stroke-width", 1)
    .style("opacity", 0)
    .transition()
    .delay(400/fps)
    .duration(100/fps)
    .style("opacity", 1)
    .transition()
    .duration(450/fps)
    .attr("y1", 350)
    .attr("y2", 350)
    .remove();

  // Let's start drawing the bar graph
  // const { width, height } = gSVG.getBoundingClientRect();

  const width = 250;
  const height = 100;
  const marginTop = 12;
  const marginBottom = 20;
  const marginLeft = 20;

  let badSamples = samples - goodSamples;
  let gs = goodSamples / samples;
  let bs = badSamples / samples;

  const xScale = d3.scaleBand()
    .domain(["(μ)", "( )"])
    .range([marginLeft, width])
    .padding(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height - marginBottom, marginTop]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
    .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1]);
  
  gsvg.selectAll("*").remove();
  gsvg.append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(xAxis);
    
  gsvg.append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "6px");

  gsvg.selectAll(".bar")
    .data([gs, bs])
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => (xScale(i === 0 ? "(μ)" : "( )") as number))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - marginBottom - yScale(d))
    .style("fill", (d, i) => i === 0 ? "blue" : "red")
    .each(function(d) {
      const bar = d3.select(this);
      gsvg.append("text")
        .attr("x", +bar.attr("x") + xScale.bandwidth() / 2)
        .attr("y", +bar.attr("y") - 5)
        .attr("text-anchor", "middle")
        .text(d.toFixed(2))
        .style("font-size", "6px");
      gsvg.append("text")
        .attr("x", +bar.attr("x") + xScale.bandwidth() + 6)
        .attr("y", height - marginBottom - 4)
        .attr("text-anchor", "middle")
        .text(d === gs ? goodSamples : badSamples)
        .style("font-size", "6px");
  });

}


let animationId: number = 0;

export function Rain(
  { SVG,
    gSVG,
    distribution,
    sampleSize,
    confidenceLevel,
    drawing,
    sps,
    whoChanged
  }: StartSampling
) {
  const svga: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(SVG);
  const gsvga: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(gSVG);
  let fps = sps ?? 1;
  let fpsInterval: number = 1000 / fps;
  let startTime: number = Date.now();
  let now: number;
  let then: number = startTime;
  let elapsed: number;

  const animate = function() {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
    makeItRain({SVG, gSVG, distribution, sampleSize, confidenceLevel, sps});
    }
    animationId = window.requestAnimationFrame(animate);
  };

  if ( whoChanged === 0 ) {

    svga.selectAll("circle").remove();
    svga.selectAll(".tick").remove();
    svga.selectAll(".ci-line").remove();
    gsvga.selectAll("*").remove();
    window.cancelAnimationFrame(animationId);
    samples = 0;
    goodSamples = 0;
  } else if ( whoChanged === 1 ) {
    if (drawing) {
        animationId = window.requestAnimationFrame(animate);
      } else {
        window.cancelAnimationFrame(animationId);
    }
  } else if ( whoChanged === 2 ) {
    svga.selectAll("circle").remove();
    svga.selectAll(".tick").remove();
    svga.selectAll(".ci-line").remove();
    window.cancelAnimationFrame(animationId);
  }
}