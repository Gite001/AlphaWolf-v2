import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
};

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={cn('relative', className)}>
            <Image
                src="/images/smartwolf.png"
                alt="AlphaWolf Logo"
                fill
                className="object-contain"
            />
        </div>
    );
};
