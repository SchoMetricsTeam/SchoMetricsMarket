"use client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEXICAN_STATES } from "@/lib/constants"; // Asume que MexicanState se exporta aquí
import type { MexicanState } from "@/lib/constants";
import { Eye, EyeOff, UserPlus, User, Lock, Mail, Home, MapPin, Hash, Building2, TrendingUp, ShoppingCart } from "lucide-react"; // Nuevos iconos
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


// Definimos el color de acento moderno y vibrante (Esmeralda/Verde)
const ACCENT_COLOR = "text-emerald-400";

const FromCreateNewUser = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        identifier: "",
        password: "",
        confirmPassword: "",
        email: "",
        city: "",
        state: "",
        postalCode: "",
        address: "",
        rfc: "",
        cct: "",
        userType: "SELLER",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Simplificamos los estados de error para manejar solo los errores al validar
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Limpiar error al cambiar el valor
        setErrors((prev) => ({ ...prev, [name]: null }));
    };


    const handleStateChange = (value: MexicanState | "") => {
        setFormData((prev) => ({ ...prev, state: value }));
        setErrors((prev) => ({ ...prev, state: null }));
    };

    const handleUserTypeChange = (value: string) => {
        setFormData((prev) => ({ ...prev, userType: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: { [key: string]: string | null } = {};

        // Validar Nombre
        if (formData.name.length < 10 || formData.name.length > 50) {
            newErrors.name = "El nombre debe tener entre 10 y 50 caracteres";
            isValid = false;
        }

        // Validar Contraseña
        if (formData.password.length < 6 || formData.password.length > 100) {
            newErrors.password = "La contraseña debe tener entre 6 y 100 caracteres";
            isValid = false;
        }

        // Validar Confirmar Contraseña
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
            isValid = false;
        }

        // **Nueva Validación de Campos Requeridos** (Añadir según la necesidad del backend)
        if (!formData.identifier) { newErrors.identifier = "El identificador es obligatorio"; isValid = false; }
        if (!formData.email) { newErrors.email = "El correo es obligatorio"; isValid = false; }
        if (!formData.state) { newErrors.state = "Debe seleccionar un estado"; isValid = false; }
        // ... (añadir más validaciones de campo si es necesario)

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Por favor, corrige los errores del formulario.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch("/api/admin/auth/user-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Enviamos todo el formData
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                toast.error(data.error || "Error al registrarse");
            } else {
                toast.success("Registro exitoso");
                toast.success("La cuenta ha sido creada correctamente");

                router.refresh();

                // Limpiar formulario
                setFormData({
                    name: "",
                    identifier: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    address: "",
                    rfc: "",
                    cct: "",
                    userType: "SELLER",
                });
            }
        } catch (error) {
            console.error("Error al registrarse:", error);
            toast.error("Error al registrarse");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        // Contenedor principal con fondo oscuro y blobs
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-2 relative overflow-hidden">
            {/* Elementos visuales de fondo (Blobs) */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Tarjeta con Glassmorphism y estilo oscuro. Mayor ancho para el formulario largo */}
            <Card className={`w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 rounded-xl relative z-10 my-10`}>
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-between items-start">
                        {/* Ícono de Registro/Admin */}
                        <UserPlus className={`h-10 w-10 ${ACCENT_COLOR} drop-shadow-lg`} />
                        <Link href="/admin/perfil">
                            <Button variant="link" className={`text-sm ${ACCENT_COLOR} hover:text-emerald-300 cursor-pointer`}>
                                ← Volver a Inicio
                            </Button>
                        </Link>
                    </div>

                    <CardTitle className={`text-3xl font-bold text-white`}>
                        CREAR NUEVA CUENTA
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-300">
                        Registro de nueva cuenta para Vendedor o Comprador.
                    </CardDescription>

                </CardHeader>
                <form onSubmit={handleSubmit}>
                    {/* Contenido dividido en 2 columnas para el formulario largo */}
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* === COLUMNA 1: Datos de Usuario y Acceso === */}
                        <div className="space-y-6 border-r md:border-r-0 md:pr-4">
                            <h3 className={`text-xl font-semibold ${ACCENT_COLOR} mb-4 border-b border-white/10 pb-2`}>
                                1. Información de Acceso
                            </h3>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4" /> Nombre completo
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre completo del usuario"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="uppercase bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                            </div>

                            {/* Identificador */}
                            <div className="space-y-2">
                                <Label htmlFor="identifier" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Identificador de Cuenta
                                </Label>
                                <Input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    placeholder="ID único o Razón social"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.identifier && (
                                    <p className="text-sm text-red-400">{errors.identifier}</p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Lock className="h-4 w-4" /> Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Contraseña segura"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full w-10 text-gray-400 hover:text-emerald-400 transition duration-200"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                    {errors.password && (
                                        <p className="text-sm text-red-400">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Lock className="h-4 w-4" /> Confirmar Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirma la contraseña"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300 pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full w-10 text-gray-400 hover:text-emerald-400 transition duration-200"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="ejemplo@dominio.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                            </div>
                        </div>

                        {/* === COLUMNA 2: Datos de Ubicación y Fiscales/Tipo === */}
                        <div className="space-y-6 md:pl-4">
                            <h3 className={`text-xl font-semibold ${ACCENT_COLOR} mb-4 border-b border-white/10 pb-2`}>
                                2. Detalles de Entidad
                            </h3>

                            {/* Ciudad */}
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> Ciudad
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Ciudad o Municipio"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.city && <p className="text-sm text-red-400">{errors.city}</p>}
                            </div>

                            {/* Estado (Select) */}
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Estado
                                </Label>
                                {/* El Select debe tener estilos para el tema oscuro si es un componente de shadcn/ui */}
                                <Select
                                    value={formData.state}
                                    onValueChange={(value) =>
                                        handleStateChange(value as MexicanState)
                                    }
                                    disabled={isLoading}
                                >
                                    <SelectTrigger id="state" className="bg-white/10 text-white border border-gray-700 focus:ring-emerald-400 cursor-pointer hover:border-emerald-400 transition duration-200">
                                        <SelectValue placeholder="Selecciona un estado" className="text-gray-400" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 text-white border border-gray-700">
                                        <SelectGroup>
                                            <SelectLabel className="text-emerald-400">Estados de México</SelectLabel>
                                            {MEXICAN_STATES.map((stateName) => (
                                                <SelectItem key={stateName} value={stateName} className="cursor-pointer hover:bg-gray-700">
                                                    {stateName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.state && <p className="text-sm text-red-400">{errors.state}</p>}
                            </div>

                            {/* Código Postal */}
                            <div className="space-y-2">
                                <Label htmlFor="postalCode" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Código Postal
                                </Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    placeholder="00000"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.postalCode && (
                                    <p className="text-sm text-red-400">{errors.postalCode}</p>
                                )}
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Home className="h-4 w-4" /> Dirección Completa
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Calle, Número, Colonia"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.address && <p className="text-sm text-red-400">{errors.address}</p>}
                            </div>

                            {/* RFC */}
                            <div className="space-y-2">
                                <Label htmlFor="rfc" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> RFC
                                </Label>
                                <Input
                                    id="rfc"
                                    name="rfc"
                                    type="text"
                                    placeholder="RFC (e.g., XAXX010101000)"
                                    value={formData.rfc}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="uppercase bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.rfc && <p className="text-sm text-red-400">{errors.rfc}</p>}
                            </div>

                            {/* CCT */}
                            <div className="space-y-2">
                                <Label htmlFor="cct" className="text-gray-200 font-semibold flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> CCT (Centro de Trabajo)
                                </Label>
                                <Input
                                    id="cct"
                                    name="cct"
                                    type="text"
                                    placeholder="Clave de Centro de Trabajo"
                                    value={formData.cct}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="uppercase bg-white/10 text-white placeholder-gray-500 border border-gray-700 focus:border-emerald-400 transition duration-300"
                                />
                                {errors.cct && <p className="text-sm text-red-400">{errors.cct}</p>}
                            </div>

                            {/* Tipo de usuario (Radio Group) */}
                            <div className="space-y-2">
                                <Label className="text-gray-200 font-semibold flex items-center gap-2 pb-2">
                                    <TrendingUp className="h-4 w-4" /> Tipo de Cuenta
                                </Label>
                                {/* Estilos aplicados al RadioGroup y sus Items */}
                                <RadioGroup
                                    value={formData.userType}
                                    onValueChange={handleUserTypeChange}
                                    className="flex flex-col justify-center items-center md:flex-row gap-4"
                                >
                                    <div className="flex items-center space-x-3 p-3 bg-white/5 border border-gray-700 rounded-lg hover:border-emerald-400 transition duration-200 cursor-pointer">
                                        <RadioGroupItem value="SELLER" id="seller" className="text-emerald-400 border-gray-500 focus:ring-emerald-400" />
                                        <Label htmlFor="seller" className="text-gray-200 flex items-center gap-2 cursor-pointer">
                                            <TrendingUp className="h-4 w-4 text-emerald-400" /> Vendedor
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-white/5 border border-gray-700 rounded-lg hover:border-emerald-400 transition duration-200 cursor-pointer">
                                        <RadioGroupItem value="BUYER" id="buyer" className="text-emerald-400 border-gray-500 focus:ring-emerald-400" />
                                        <Label htmlFor="buyer" className="text-gray-200 flex items-center gap-2 cursor-pointer">
                                            <ShoppingCart className="h-4 w-4 text-cyan-400" /> Comprador
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                        </div>
                    </CardContent>

                    {/* Botón de Submit y Footer */}
                    <CardFooter className="flex flex-col space-y-4 pt-8 border-t border-white/10 mt-6">
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-emerald-600/50 transition duration-300 transform hover:scale-[1.005] flex items-center gap-2 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Registrando cuenta...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Registrar Cuenta</span>
                                </>
                            )}
                        </Button>
                        <div className="text-center text-xs text-gray-500">
                            La nueva cuenta será creada y activada por el sistema.
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default FromCreateNewUser;