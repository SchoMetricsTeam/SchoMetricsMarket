"use client";

import { cn } from "@/lib/utils";
import { BadgeDollarSign, Brain, Earth, LogIn, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:paused",
        )}
      >
        {/* For Buyers */}
        <li
          className="group relative w-[350px] max-w-full shrink-0 rounded-3xl border border-emerald-200/50 bg-linear-to-br from-emerald-50 via-white to-teal-50 px-8 py-8 shadow-lg shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 md:w-[450px]"
        >
          {/* Efecto de brillo en el borde */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-5"
          ></div>

          {/* Contenido de la tarjeta */}
          <blockquote className="relative">
            {/* Icono decorativo */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Título con badge */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur-sm">
                Para Compradores
              </span>
            </div>

            {/* Descripción */}
            <span className="relative z-20 block text-center text-base leading-relaxed text-neutral-700">
              Disponible para <span className="font-semibold text-emerald-700">Empresas y Compradores</span> que requieren{" "}
              <span className="font-semibold text-emerald-700">Materiales reciclables</span> (Plástico, Papel, Cartón, Aluminio, etc.) a un{" "}
              <span className="font-semibold text-emerald-700">precio increíble</span>.
            </span>

            {/* CTA */}
            <div className="relative z-20 mt-6 flex flex-col items-center justify-center gap-2">
              <div className="group/cta flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-5 py-2.5 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40">
                <Link
                  href="/contacto"
                  className="text-sm font-semibold text-white">
                  Solicita tu cuenta de Comprador
                </Link>
                <svg
                  className="h-4 w-4 text-white transition-transform duration-300 group-hover/cta:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="group/cta flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-50 to-teal-100 px-5 py-2.5 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40">
                <Link
                  href="/iniciar-sesion/comprador"
                  className="text-sm font-semibold text-teal-600">
                  Iniciar Sesión
                </Link>
                <LogIn className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </blockquote>
        </li>
        {/* For Sellers */}
        <li
          className="group relative w-[350px] max-w-full shrink-0 rounded-3xl border border-indigo-200/50 bg-linear-to-br from-indigo-50 via-white to-purple-50 px-8 py-8 shadow-lg shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 md:w-[450px]"
        >
          {/* Efecto de brillo en el borde */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-5"
          ></div>

          {/* Contenido de la tarjeta */}
          <blockquote className="relative">
            {/* Icono decorativo */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <BadgeDollarSign className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Título con badge */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm">
                Para Vendedores
              </span>
            </div>

            {/* Descripción */}
            <span className="relative z-20 block text-center text-base leading-relaxed text-neutral-700">
              Disponible para <span className="font-semibold text-indigo-700">Escuelas y Vendedores</span> que tienen y quieren vender{" "}
              <span className="font-semibold text-indigo-700">Materiales reciclables</span> (Plástico, Papel, Cartón, Aluminio, etc.) y obtener{" "}
              <span className="font-semibold text-indigo-700">increíbles ingresos</span>.
            </span>

            {/* CTA */}
            <div className="relative z-20 mt-6 flex flex-col items-center justify-center gap-2">
              <div className="group/cta flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40">
                <Link
                  href="/contacto"
                  className="text-sm font-semibold text-white">
                  Solicita tu cuenta de Vendedor
                </Link>
                <svg
                  className="h-4 w-4 text-white transition-transform duration-300 group-hover/cta:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="group/cta flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-50 to-purple-100 px-5 py-2.5 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40">
                <Link
                  href="/iniciar-sesion/vendedor"
                  className="text-sm font-semibold text-indigo-500">
                  Iniciar Sesión
                </Link>
                <LogIn className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
          </blockquote>
        </li>
        {/* For All */}
        <li
          className="group relative w-[350px] max-w-full shrink-0 rounded-3xl border border-orange-200/50 bg-linear-to-br from-orange-50 via-white to-amber-50 px-8 py-8 shadow-lg shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 md:w-[450px]"
        >
          {/* Efecto de brillo en el borde */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-linear-to-r from-orange-400 via-amber-400 to-orange-400 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-5"
          ></div>

          {/* Contenido de la tarjeta */}
          <blockquote className="relative">
            {/* Icono decorativo */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <Earth className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Título con badge */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-700 backdrop-blur-sm">
                Para Todos
              </span>
            </div>

            {/* Descripción */}
            <span className="relative z-20 block text-center text-base leading-relaxed text-neutral-700">
              Forma parte de esta increíble comunidad que promueve la{" "}<span className="font-semibold text-orange-700">Ecología y Economía</span> a través de la compra y venta de{" "}
              <span className="font-semibold text-orange-700">Materiales reciclables</span>.
              <br />
              Aporta tu granito de arena y contribuye al.
              {" "}
              <span className="font-semibold text-orange-700">Medio Ambiente en México</span>.
            </span>

            {/* CTA */}
            <div className="relative z-20 mt-6 flex flex-col items-center justify-center gap-2">
              <div className="group/cta flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 px-5 py-2.5 shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40">
                <Link
                  href="/contacto"
                  className="text-sm font-semibold text-white">
                  ¡ Contactar Ahora !
                </Link>
                <svg
                  className="h-4 w-4 text-white transition-transform duration-300 group-hover/cta:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </blockquote>
        </li>
      </ul>
    </div>
  );
};
