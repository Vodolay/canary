// 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languages } from '@/i18n/settings';
import { Button } from '@nextui-org/react';
import { MdLanguage } from 'react-icons/md';

interface LocaleSwitcherProps {
    lng: string;
}

export default function LocaleSwitcher({ lng }: LocaleSwitcherProps) {
    const pathname = usePathname().toString();
    const la = languages.filter((l) => lng !== l).toString();
    const newpath = pathname.replace(lng, la);

    return (
        <div>
            <Link href={newpath}>
                <Button
                    color="primary"
                    endContent={<MdLanguage />}
                    className="uppercase font-semibold"
                >
                    {la}
                </Button>
            </Link>
        </div>
    );
}