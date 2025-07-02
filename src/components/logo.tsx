import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
};

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={cn('relative h-8 w-8', className)}>
            <Image
                src="/images/logo.png"
                alt="AdInsights Logo"
                fill
                className="object-contain"
            />
        </div>
    );
};
