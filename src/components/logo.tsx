import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
};

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={cn('relative', className)}>
            <Image
                src="https://placehold.co/128x128.png"
                alt="AlphaWolf Logo"
                fill
                className="object-contain"
                data-ai-hint="wolf logo"
            />
        </div>
    );
};
