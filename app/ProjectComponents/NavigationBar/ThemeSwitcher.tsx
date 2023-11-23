'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const dark = theme === 'dark';
    const [mounted, setMounted] = useState(true);

    const toggleTheme = () => {
        setTheme(dark ? 'light' : 'dark');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    //if (!mounted) return null;

    return (
        <div className="flex gap-2 items-center">
            {/* <Button isIconOnly onClick={() => setTheme('light')}>
        <BsFillMoonFill className="text-green-500" />
      </Button>
      <Button isIconOnly onClick={() => setTheme('dark')}>
        <BsSunFill />
      </Button> */}
            {mounted && (
                <Button isIconOnly onClick={toggleTheme} className="bg-transparent">
                    {dark ? <BsSunFill /> : <BsFillMoonFill />}
                </Button>
            )}
        </div>
    );
}