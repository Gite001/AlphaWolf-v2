import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export const Logo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-6 w-6', className)}
        {...props}
    >
        <g fill="none" strokeWidth="3">
            <path 
                d="M25 2 L5 15 V35 L25 48 L45 35 V15 L25 2 Z" 
                stroke="hsl(var(--primary))" 
                className="transition-all"
                fill="hsl(var(--primary))"
                fillOpacity="0.1"
            />
            <path 
                d="M14 32 L20 26 L25 31 L31 25 L36 30" 
                stroke="hsl(var(--accent))" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-all"
            />
            <path 
                d="M25 10 V19" 
                stroke="hsl(var(--primary))" 
                strokeLinecap="round"
            />
             <path 
                d="M18 15 L25 19 L32 15" 
                stroke="hsl(var(--primary))" 
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);
