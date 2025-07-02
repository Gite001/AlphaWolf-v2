import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export const Logo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-8 w-8', className)}
        {...props}
    >
        <g fill="none" strokeWidth="2.5">
            <path 
                d="M25 4 L5 16 L10 32 L25 46 L40 32 L45 16 Z" 
                stroke="hsl(var(--primary))" 
                className="transition-all"
                fill="hsl(var(--primary))"
                fillOpacity="0.15"
            />
            <path 
                d="M16 28 L22 22 L28 28 L34 22" 
                stroke="hsl(var(--accent))" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-all"
                strokeWidth="3"
            />
            <path 
                d="M25 35 L25 46" 
                stroke="hsl(var(--primary))" 
                strokeLinecap="round"
            />
        </g>
    </svg>
);