import * as fs from 'fs';
import React, { ReactNode } from 'react';
import Navigation, { NavigationProps } from '@/ProjectComponents/NavigationBar/Navigation';


interface LayoutProps {
    params: { lng: string };
    children: ReactNode;
}

export function generateStaticParams() {
    return [{ lng: 'en' }, { lng: 'fr' }]
}

export default async function Layout(
    { params, children }: LayoutProps
) {
    const { lng } = params

    const jsonString = fs.readFileSync('app/ProjectComponents/NavigationBar/navigation.json', 'utf-8');
    const jsonData = JSON.parse(jsonString);
    let trans = jsonData[`${lng}`] as NavigationProps;


    return (
        <>
            <Navigation lng={lng} trans={trans} />
            {children}
        </>
    );
}