"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, School, Menu, X, LogIn, Building, BookOpen, ShoppingCart, BadgeDollarSign } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-primary/5"
        : "bg-white backdrop-blur-lg border-b border-border/50"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/schometrics-logo.png"
              alt="SchoMetrics"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <Select>
            <SelectTrigger className="w-[180px] border-blue-100 border-2 text-lime-500 font-bold hover:border-schoMetricsBaseColor cursor-pointer transition-all ease-linear">
              <LogIn className="h-7 w-7" />
              <SelectValue placeholder="Iniciar Sesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-lime-500 font-semibold">Soy:</SelectLabel>
                <Link
                  href="/iniciar-sesion/comprador"
                  className="px-3 py-1 rounded-sm flex items-center gap-2 text-teal-600 font-semibold bg-transparent hover:bg-teal-100 cursor-pointer"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Comprador
                </Link>
                <Link
                  href="/iniciar-sesion/vendedor"
                  className="px-3 py-1 rounded-sm flex items-center gap-2 text-indigo-600 font-semibold bg-transparent hover:bg-indigo-200 cursor-pointer"
                >
                  <BadgeDollarSign className="h-5 w-5" />
                  Vendedor
                </Link>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  )
}
