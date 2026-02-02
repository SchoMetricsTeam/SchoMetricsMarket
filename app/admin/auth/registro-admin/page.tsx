"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, Lock, User, Key, Terminal, UserLock, IdCard } from "lucide-react"; // Añadimos iconos
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

// Definimos el color de acento moderno y vibrante (Esmeralda/Verde)
const ACCENT_COLOR = "text-emerald-400"; // Usaremos este color para acentos, iconos y enlaces.

export default function AdminRegistroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminCode, setAdminCode] = useState(""); // Este código se mantiene fuera de formData para ser manejado directamente

  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
    // El campo 'secretAdminCode' fue eliminado del estado en el código original,
    // por lo que no lo incluimos aquí. Usaremos 'adminCode' directamente.
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name || !formData.identifier || !formData.password || !adminCode) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Nota: La lógica de validación de 'adminCode' contra 'process.env.ADMIN_SECRET_CODE'
    // debe ser manejada en el backend por seguridad.
    // Aquí, se mantiene la validación frontend mínima para la UI.

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/admin-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          identifier: formData.identifier,
          password: formData.password,
          adminCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar administrador");
      } else {
        toast.success("Registro exitoso");
        toast.success("Tu cuenta de administrador ha sido creada");

        // Redirigir al login de administrador
        router.push("/admin/auth/login-admin");
        router.refresh();
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      // Se simplifica el mensaje de error para el usuario
      toast.error("Error al registrar administrador. Verifica los datos y el código.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fondo: Oscuro profundo con el mismo degradado sutil
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Elementos visuales de fondo (Blobs para atractivo) */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Tarjeta con Glassmorphism y estilo oscuro */}
      <Card
        className={`w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 rounded-xl relative z-10 my-10`}
      >
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            {/* Ícono de Registro/Admin, manteniendo la marca de la interfaz de Login */}
            <UserLock className={`h-12 w-12 ${ACCENT_COLOR} drop-shadow-lg`} />
          </div>
          <CardTitle className={`text-3xl font-bold text-white flex items-center justify-center gap-2`}>
            REGISTRO ADMINISTRADOR
          </CardTitle>
          <CardDescription className="text-sm text-gray-300">
            Crea tu cuenta de administración con el código secreto.
          </CardDescription>

          {/* Botón de volver a Login con estilo minimalista */}
          <Link href="/admin/materiales-comprados">
            <Button variant="link" className={`text-sm ${ACCENT_COLOR} hover:text-emerald-300 cursor-pointer`}>
              ← Volver a Inicio
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Campo: Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200 font-semibold">
                <User className="inline h-4 w-4 mr-2" /> Nombre completo
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre Apellido"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Campo: Identificador de Cuenta */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-200 font-semibold">
                <IdCard className="inline h-4 w-4 mr-2" /> Identificador
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="admin.user | ID_UNICO"
                  value={formData.identifier}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pl-10"
                />
                <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200 font-semibold">
                <Lock className="inline h-4 w-4 mr-2" /> Contraseña
              </Label>
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
                  className="absolute right-0 top-0 h-full w-10 text-gray-400 hover:text-emerald-400 transition duration-200 bg-transparent cursor-pointer hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            {/* Campo: Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200 font-semibold">
                <Lock className="inline h-4 w-4 mr-2" /> Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
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
                  className="absolute right-0 top-0 h-full w-10 text-gray-400 hover:text-emerald-400 transition duration-200 bg-transparent cursor-pointer hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            {/* Campo: Código de administrador */}
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-gray-200 font-semibold">
                <Key className="inline h-4 w-4 mr-2" /> Código de administrador
              </Label>
              <div className="relative">
                <Input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  placeholder="Código secreto"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pl-10"
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 text-left pt-1">
                Este código es proporcionado por el desarrollador del sistema.
              </p>
            </div>

            {/* Botón de Registrarse con color de acento */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-emerald-600/50 transition duration-300 transform hover:scale-[1.01] flex items-center gap-2 mt-8 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Registrar Administrador</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>

        {/* Footer con texto de advertencia (similar al login) */}
        <div className="p-6 pt-0 text-center text-xs text-gray-400 border-t border-white/10 mt-6">
          <p className="font-mono">
            <span className={`${ACCENT_COLOR}`}>[!]</span> Acceso restringido. Solo administradores autorizados.
          </p>
        </div>
      </Card>
    </div>
  );
}