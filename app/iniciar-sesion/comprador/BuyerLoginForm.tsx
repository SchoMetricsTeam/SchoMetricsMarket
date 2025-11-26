"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, BadgeInfo, Lock, User, LogIn, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Image from "next/image";

export default function BuyerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/comprador/materiales-disponibles";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("Identificador de Sesión y contraseña son obligatorios");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/buyer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Los datos ingresados son incorrectos");
      } else {
        toast.success("Bienvenido");
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión. Intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group relative w-full max-w-md overflow-hidden border-0 bg-white shadow-2xl shadow-emerald-500/20 backdrop-blur-xl transition-all duration-500 hover:shadow-emerald-500/30">
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-100/20 via-teal-100/20 to-emerald-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute -right-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-linear-to-br from-emerald-400 to-teal-500 opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-linear-to-tr from-teal-400 to-emerald-500 opacity-20 blur-3xl" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group/logo flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/50 transition-all duration-300 group-hover/logo:shadow-emerald-500/70">
                <Image
                  src="/schometrics-logo.png"
                  alt="logo"
                  width={32}
                  height={32}
                  priority
                  className="brightness-0 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SchoMetrics
                </span>
                <span className="text-xs text-muted-foreground">Portal para Comprador</span>
              </div>
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-300 hover:bg-emerald-100">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Iniciar sesión
              </span>
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              Accede a tu cuenta <b className="text-teal-600">Comprador</b> de forma segura
            </CardDescription>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-linear-to-br from-blue-50 to-sky-50 p-4 border border-blue-100/50 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <BadgeInfo className="h-5 w-5" />
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              El <span className="font-semibold text-blue-700">Identificador de Sesión</span> es sensible a mayúsculas y minúsculas.
              <br />
              <span className="text-xs text-slate-600 mt-1 block">Ejemplo: "AA001" ≠ "aa001"</span>
            </p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
            <div className="group/input space-y-2">
              <Label htmlFor="identifier" className="text-sm font-semibold text-slate-700">
                Identificador de Sesión
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within/input:text-emerald-600">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Ej: AA001"
                  value={formData.identifier}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-12 border-slate-200 pl-12 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="group/input space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Contraseña
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within/input:text-emerald-600">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña segura"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-12 border-slate-200 pl-12 pr-12 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition-colors hover:text-slate-700 focus:outline-none"
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-teal-600 cursor-pointer" />
                  ) : (
                    <Eye className="h-5 w-5 text-teal-600 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/login/recuperar-password"
                className="group/link text-sm font-medium text-emerald-600 transition-all duration-300 hover:text-emerald-700"
              >
                ¿Olvidaste tu contraseña?
                <span className="block h-0.5 max-w-0 bg-emerald-600 transition-all duration-300 group-hover/link:max-w-full" />
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="group/btn relative h-12 w-full overflow-hidden bg-linear-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/50 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              disabled={isLoading}
            >
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </span>
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              <span>Conexión segura y encriptada</span>
            </div>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
