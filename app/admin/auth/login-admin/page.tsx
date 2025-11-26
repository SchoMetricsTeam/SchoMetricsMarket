"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Terminal } from "lucide-react"; // Añadimos iconos
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Image from "next/legacy/image";

// Definimos un color de acento moderno y vibrante
const ACCENT_COLOR = "text-emerald-400"; // O 'text-cyan-400' para un azul eléctrico

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      } else {
        toast.success("Inicio de sesión exitoso");
        toast.success("Bienvenido al panel de administración");
        router.push("/admin/materiales-comprados");
        router.refresh();
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Los datos ingresados son incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Rediseño del fondo: Oscuro profundo con un degradado o patrón sutil
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Elementos visuales de fondo (opcional, para mayor atractivo) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Tarjeta con Glassmorphism y estilo oscuro */}
      <Card
        className={`w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 rounded-xl relative z-10`}
      >
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center justify-between gap-3">
//             <Image
                src="/schometrics-logo-white.png"
                alt="logo"
                width={100}
                height={100}
                priority
                objectFit="contain"
              />
            </Link>
          </div>
          <CardTitle className={`text-3xl font-bold text-white flex items-center justify-center gap-2`}>
            ADMIN LOGIN
          </CardTitle>
          <CardDescription className="text-sm text-gray-300">
            Acceso Exclusivo al Panel de Administración.
          </CardDescription>
          {/* Botón de volver a Inicio con estilo minimalista */}
          <Link href="/" className="w-full">
            <Button variant="link" className={`text-sm ${ACCENT_COLOR} hover:text-emerald-300 cursor-pointer`}>
              ← Volver a Inicio
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Identificador */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-200 font-semibold">
                <User className="inline h-4 w-4 mr-2" /> Identificador de Sesión
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="admin.user | 12345678"
                  value={formData.identifier}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
                <Label htmlFor="password" className="text-gray-200 font-semibold">
                  <Lock className="inline h-4 w-4 mr-2" /> Contraseña
                </Label>
                <Link
                  href="/login/recuperar-password"
                  className={`text-xs ${ACCENT_COLOR} hover:underline transition duration-200`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pl-10 pr-12"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-transparent hover:bg-transparent cursor-pointer absolute right-0 top-0 h-full w-10 text-gray-400 hover:text-emerald-400 transition duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Botón de Iniciar Sesión con color de acento */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-emerald-600/50 transition duration-300 transform hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <Terminal className="h-5 w-5" />
                  <span>Iniciar sesión</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
        {/* Footer con texto de advertencia */}
        <div className="p-6 pt-0 text-center text-xs text-gray-400 border-t border-white/10 mt-6">
          <p className="font-mono">
            <span className={`${ACCENT_COLOR}`}>[!]</span> Acceso restringido. Solo personal autorizado.
          </p>
        </div>
      </Card>
      {/* Nota: Se eliminó CardFooter para integrar el texto de advertencia al final de la CardContent,
      pero puedes reinstalarlo si prefieres la estructura original de `shadcn/ui`. */}
    </div>
  );
}

// Puedes añadir estilos de animación en un archivo CSS global si es necesario
// para las clases 'animate-blob' y 'animation-delay-2000'.