'use client'

import React from 'react'
import { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Input } from "@nextui-org/react";
import LocaleSwitcher from './LocaleSwitcher'
import ThemeSwitcher from './ThemeSwitcher';
import { BiSolidHome, BiSearch } from 'react-icons/bi'
import { usePathname } from 'next/navigation'


export interface NavigationProps {
    lng: string,
    aboutPage: string,
    appsPage: string,
    notesPage: string,
    searchText: string
}

interface NavigationParams {
    lng: string;
    trans: NavigationProps;
}

export default function Navigation({ lng, trans }: NavigationParams) {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className='sm: max-w-[90vw] mx-auto'>
            <Navbar 
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen} 
                isBordered shouldHideOnScroll 
                maxWidth='full' 
                className='px-2 sm:px-10' 
            >
                {/* Left part of navigation bar; contains branding */}

                <NavbarContent data-justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close Menu" : "Open Menu"} className='sm:hidden' />
                    <NavbarBrand >
                        <Link href="/">
                            <BiSolidHome size={30} className='primary' />
                        </Link>

                    </NavbarBrand>
                </NavbarContent>

                {/* Center part of the navigation bar; contains links to navigate to other parts of the webpage */}

                <NavbarContent className='hidden sm:flex' data-justify='start'>
                    <NavbarItem isActive>
                        Canary broke it
                    </NavbarItem>

                </NavbarContent>

                {/* Right part of navigation bar; contains switches for locale and theme */}

                <NavbarContent className='flex gap-2 uppercase px-5' data-justify='end'>
                    <ThemeSwitcher />
                    <LocaleSwitcher lng={lng} />
                </NavbarContent>

                {/* Navigation menu for small screens */}

                <NavbarMenu>
                    <NavbarMenuItem>
                        Canary broke it
                    </NavbarMenuItem>
                </NavbarMenu>

            </Navbar >
        </div>
    )
}
