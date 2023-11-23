import React from 'react';
import * as fs from 'fs';
import Link from 'next/link'

interface SectionProps {
  params: { lng: string }
}


export default function Home( { params }: SectionProps ) {

  const { lng } = params

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-3xl lg:flex">
          <ol>
            <li><Link href={`/${lng}/confint/one`}>Con Interval</Link></li>
          </ol>
      </div>
    </main>
  )
}
