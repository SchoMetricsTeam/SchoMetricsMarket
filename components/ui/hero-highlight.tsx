"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React from "react";
import { Button } from "./button";
import Link from "next/link";
import { Building2, School } from "lucide-react";
import { InfiniteMovingCards } from "./infinite-moving-cards";

export const HeroHighlight = ({
    children,
    className,
    containerClassName,
}: {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    // SVG patterns for different states and themes
    const dotPatterns = {
        light: {
            default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23d4d4d4' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
            hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%236366f1' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
        },
    };

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent<HTMLDivElement>) {
        if (!currentTarget) return;
        let { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (
        <div
            className={cn(
                "group relative flex h-340 sm:h-320 xl:h-300 w-full items-center justify-center bg-white",
                containerClassName,
            )}
            onMouseMove={handleMouseMove}
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: dotPatterns.light.default,
                }}
            />
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    backgroundImage: dotPatterns.light.hover,
                    WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
                    maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
                }}
            />
            <div className={cn("relative z-20 w-full", className)}>{children}
                <div className="mt-5 rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards
                        direction="right"
                        speed="slow"
                    />
                </div>
                <div className="text-center pb-10 pt-16 relative z-10">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-zinc-700 leading-tight">
                        ¿Quieres Formar Parte del Cambio?
                    </div>
                    <div className="bg-white text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Únete a SchoMetrics hoy y forma parte de esta increíble{" "}
                        <span className="text-lime-500 font-semibold">red de compra y venta de México</span>
                    </div>
                    <Button
                        asChild
                        size="lg"
                        className="mt-5 text-lg px-10 py-7 bg-linear-to-r from-lime-400 to-lime-500 text-white hover:from-lime-500 hover:to-lime-300 transition-all hover:scale-105 font-semibold shadow-lg shadow-lime-200 hover:shadow-xl hover:shadow-lime-300 animate-heartbeat"
                    >
                        <Link href="/contacto">
                            ¡ Contactar Ahora !
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.span
            initial={{
                backgroundSize: "0% 100%",
            }}
            animate={{
                backgroundSize: "100% 100%",
            }}
            transition={{
                duration: 2,
                ease: "linear",
                delay: 0.5,
            }}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                display: "inline",
            }}
            className={cn(
                `relative inline-block rounded-lg bg-linear-to-r from-lime-400 to-lime-500 px-1 pb-1 mr-2 leading-normal`,
                className,
            )}
        >
            {children}
        </motion.span>
    );
};
