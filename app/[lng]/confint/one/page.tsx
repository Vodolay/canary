import React from 'react';
import * as fs from 'fs';
import { CisTop } from "./cisTop";

interface Lang {
  params: { lng: string };
}

export interface Item {
  key: number;
  label: string;
}
export interface CisProps {
  leftTitle: string;
  blob: string;
  chooseDist: string;
  buttonChoose: string;
  chooseSize: string;
  chooseLevel: string;
  startSampling: string;
  stopSampling: string;
  samplingSpeed: number;
  rightTitle: string;
  graphTitle: string;
  choiceDist: Item[];
  density: string;
  estimate: string;
}

export interface CisParams {
  lng: string;
  trans: CisProps;
}

export default function Home( { params }: Lang ) {
  
  const { lng } = params
  const jsonString = fs.readFileSync("app/[lng]/confint/one/cisText.json", 'utf-8');
  const jsonData = JSON.parse(jsonString);
  let trans = jsonData[`${lng}`] as CisProps;

  return (
      <div id="cis">
        <CisTop lng={lng} trans={trans} />
      </div>
  )
}
