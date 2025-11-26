"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns"; // Import formatDistanceToNow
import { es } from "date-fns/locale"; // Import es locale
import {
    User,
    Calendar as CalendarIconLucide,
    Edit,
    Camera,
    Save,
    X,
    Trash2, // Renamed Calendar to CalendarIconLucide
    Loader2, // Added Bell, CheckCircle, MailOpen
    MSquareIcon,
    BadgeAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { validateAvatarFile } from "@/lib/supabase-service"; // Assuming this path is correct
import toast from "react-hot-toast"; // Using react-hot-toast as per your original code
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "./components/change-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import LoaderCircle from "@/app/components/LoaderCircle";
import { BuyerUserProfileData } from "@/types/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEXICAN_STATES, MexicanState } from "@/lib/constants";
import { BuyerNavigation } from "@/app/components/buyer/BuyerNavigation";

export default function BuyerProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profile, setProfile] = useState<BuyerUserProfileData | null>(null); // Initialize as null
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        state: "",
        postalCode: "",
        address: "",
        rfc: "",
        cct: "",
    });
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
        null,
    );
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados para notificaciones
    const [activeTab, setActiveTab] = useState("info"); // Para manejar la pestaña activa

    const fetchProfileData = async () => {
        // setIsLoading(true) will be handled by the main isLoading state
        try {
            const response = await fetch("/api/buyer/profile");
            if (!response.ok) throw new Error("Error al obtener perfil");
            const data: BuyerUserProfileData = await response.json();
            setProfile(data);
            setFormData({
                name: data.name || "",
                email: data.profile?.email || "",
                city: data.profile?.city || "",
                state: data.profile?.state || "",
                postalCode: data.profile?.postalCode || "",
                address: data.profile?.address || "",
                rfc: data.profile?.rfc || "",
                cct: data.profile?.cct || "",

            });
            setAvatarPreviewUrl(null);
            setSelectedAvatarFile(null);
        } catch (error) {
            console.error("Error al cargar perfil:", error);
            toast.error("Error, No se pudo cargar el perfil");
        }
        // setIsLoading(false) will be handled by the main isLoading state
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchProfileData()]);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateAvatarFile(file); // Assuming validateAvatarFile is defined elsewhere
            if (!validation.valid) {
                toast.error(
                    validation.error ||
                    "Archivo inválido. Error de validación de archivo.",
                );
                setSelectedAvatarFile(null);
                setAvatarPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            } else {
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedAvatarFile(file);
                setAvatarPreviewUrl(URL.createObjectURL(file));
            }
            router.refresh();
        }
    };

    const triggerAvatarUpload = () => {
        fileInputRef.current?.click();
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("city", formData.city);
        payload.append("state", formData.state);
        payload.append("postalCode", formData.postalCode);
        payload.append("address", formData.address);
        payload.append("rfc", formData.rfc);
        payload.append("cct", formData.cct);
        if (selectedAvatarFile) payload.append("avatarFile", selectedAvatarFile);

        try {
            const response = await fetch("/api/buyer/profile", {
                method: "PUT",
                body: payload,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar perfil");
            }
            const updatedProfile: BuyerUserProfileData = await response.json();
            setProfile(updatedProfile);
            // Actualizar formData con los datos del perfil actualizado
            setFormData({
                name: updatedProfile.name || "",
                email: updatedProfile.profile?.email || "",
                city: updatedProfile.profile?.city || "",
                state: updatedProfile.profile?.state || "",
                postalCode: updatedProfile.profile?.postalCode || "",
                address: updatedProfile.profile?.address || "",
                rfc: updatedProfile.profile?.rfc || "",
                cct: updatedProfile.profile?.cct || "",
            });
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setIsEditing(false);
            toast.success(
                "Perfil actualizado. Tu perfil ha sido actualizado correctamente.",
            );
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error. No se pudo actualizar el perfil.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAvatar = async () => {
        // Usar profile.profile.avatarUrl (fileKey) para la comprobación, no publicAvatarDisplayUrl
        if (!profile?.profile?.publicAvatarDisplayUrl) {
            toast.error("No hay foto de perfil para eliminar.");
            return;
        }
        setIsSubmitting(true);
        const payload = new FormData();
        // Enviar los datos actuales del formulario para no perderlos si solo se borra el avatar
        Object.entries(formData).forEach(([key, value]) =>
            payload.append(key, value),
        );
        payload.append("deleteAvatar", "true");

        try {
            const response = await fetch("/api/buyer/profile", {
                method: "PUT",
                body: payload,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Error al eliminar la foto de perfil",
                );
            }
            const updatedProfile: BuyerUserProfileData = await response.json();
            setProfile(updatedProfile);
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.success(
                "Foto de perfil eliminada. Tu foto de perfil ha sido eliminada.",
            );
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar avatar:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar la foto de perfil.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStateChange = (value: MexicanState | "") => {
        setFormData((prev) => ({ ...prev, state: value }));
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.profile?.email || "",
                city: profile.profile?.city || "",
                state: profile.profile?.state || "",
                postalCode: profile.profile?.postalCode || "",
                address: profile.profile?.address || "",
                rfc: profile.profile?.rfc || "",
                cct: profile.profile?.cct || "",
            });
        }
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsEditing(false);
    };

    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
        }
        return format(date, "dd MMM, yyyy", { locale: es });
    };

    const getInitials = (name: string = "") =>
        name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";
    const AvatarInput = () => (
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept=".jpg,.jpeg,.png,.webp"
            style={{ display: "none" }}
            disabled={isSubmitting}
        />
    );

    if (isLoading) {
        return (
            <LoaderCircle />
        );
    }
    if (!profile) {
        return (
            <div className="m-5 flex h-screen flex-col items-center justify-center gap-8 sm:m-10">
                <h3 className="text-lg font-medium">No se pudo cargar el perfil</h3>
                <p className="mt-1 text-muted-foreground">
                    Intenta recargar la página.
                </p>
                <Button onClick={fetchProfileData}>Reintentar</Button>
            </div>
        );
    }
    return (
        <div>
            <BuyerNavigation />
            {AvatarInput()}
            <div className="m-5 flex flex-col gap-8 sm:m-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-100 to-white rounded-lg border border-teal-600">
                        <User className="h-6 w-6 text-teal-800 animate-bounce" />
                    </div>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-900 to-emerald-800 bg-clip-text text-transparent">
                        Mi Perfil
                    </h1>
                </div>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    Gestiona y mantén siempre completa la información
                </p>
                <div className="flex w-full flex-col items-center justify-center gap-6 lg:justify-between xl:flex-row xl:items-start">
                    {" "}
                    {/* Manteniendo xl:grid-cols-3 */}
                    <Card className="w-full select-none md:col-span-1 bg-teal-50 border-teal-100 text-white shadow-md shadow-teal-100">
                        {" "}
                        {/* Ajustado para que el perfil ocupe 1 columna en md y más grandes */}
                        <CardHeader className="relative">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <Avatar
                                        className="pointer-events-none h-24 w-24 select-none"
                                        draggable={false}
                                        onDragStart={(e) => e.preventDefault()}
                                    >
                                        <AvatarImage
                                            src={
                                                avatarPreviewUrl ||
                                                profile.profile?.publicAvatarDisplayUrl ||
                                                ""
                                            }
                                            alt={profile.name || "Avatar"}
                                        />
                                        <AvatarFallback className="bg-teal-600 text-3xl border-2 border-white uppercase text-white font-bold">
                                            {getInitials(profile.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && ( // Mostrar botón de cámara solo en modo edición
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full bg-white border-none cursor-pointer"
                                            onClick={triggerAvatarUpload}
                                            disabled={isSubmitting}
                                            title="Cambiar foto"
                                        >
                                            <Camera className="h-4 w-4 text-green-500" />
                                            <span className="sr-only">Cambiar foto</span>
                                        </Button>
                                    )}
                                </div>
                                {/* Mostrar botón de eliminar solo si hay avatar y está en modo edición */}
                                {isEditing &&
                                    profile.profile?.publicAvatarDisplayUrl &&
                                    !avatarPreviewUrl && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-red-500 hover:text-red-700 cursor-pointer"
                                            onClick={handleDeleteAvatar}
                                            disabled={isSubmitting}
                                            title="Eliminar foto"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Eliminar foto
                                        </Button>
                                    )}
                                {avatarPreviewUrl && (
                                    <p className="mt-1 text-xs text-sky-600">
                                        Nueva foto seleccionada (Da clic en Guardar para aplicar)
                                    </p>
                                )}
                                {!isEditing && (
                                    <p className="mt-4 px-5 text-center text-xs text-emerald-500 lg:px-10">
                                        Para cambiar la foto de Perfil da clic en "Editar
                                        Información" y luego en "Guardar".
                                    </p>
                                )}
                                <CardTitle className="mt-4 text-center text-xl uppercase text-teal-600">
                                    {profile.name}
                                </CardTitle>
                                <div className="w-full overflow-auto text-center text-schoMetricsBaseColor font-semibold">
                                    {profile.profile?.email}
                                </div>
                                <CardDescription>
                                    Indentificador de Cuenta:{" "}
                                    <span className="font-bold text-schoMetricsBaseColor uppercase">
                                        {profile.identifier}
                                    </span>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <div className="mt-10 flex items-center gap-2 text-sm">
                                    <CalendarIconLucide className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Miembro desde:</span>
                                    <span className="text-teal-600 font-semibold">{formatDate(profile.createdAt, false)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Tipo de Cuenta:</span>
                                    <span className="text-teal-600 font-semibold">
                                        {profile.userType === "SELLER"
                                            ? "VENDEDOR"
                                            : profile.userType === "BUYER"
                                                ? "COMPRADOR"
                                                : profile.userType === "ADMIN"
                                                    ? "ADMINISTRADOR"
                                                    : "SIN TIPO"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MSquareIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Identificador de Cuenta:</span>
                                    <span className="text-teal-600 font-semibold">{profile.identifier}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span w-full bg-teal-50 border-teal-100">
                        {" "}
                        {/* Ajustado para que las pestañas ocupen 2 columnas en md y más grandes */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <CardHeader>
                                <div className="flex flex-col items-center justify-between gap-2 pb-2">
                                    {" "}
                                    {/* Reducido mb */}
                                    <CardTitle className="flex gap-2 mb-2">
                                        <div className="p-2 bg-linear-to-br from-blue-100 to-white rounded-lg border border-schoMetricsBaseColor">
                                            <Edit className="h-6 w-6 text-schoMetricsBaseColor" />
                                        </div>
                                        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                                            Detalles de la Cuenta
                                        </h1>
                                    </CardTitle>
                                    <CardDescription className="text-center text-red-500 flex gap-2 justify-center items-center font-semibold">
                                        <BadgeAlert className="h-6 w-6 animate-heartbeat" />
                                        Por favor, manten siempre completa toda la información de tu Perfil para Apartar Materiales Reciclables.
                                    </CardDescription>
                                    <CardDescription className="text-center text-emerald-500 font-normal">
                                        El <b>(Nombre y RFC)</b> son datos que requieren validación previa, por lo tanto no se permite modificarlos, si necesitas actualizar la información, comunícate a <b>soporte@schometrics.com</b>
                                    </CardDescription>
                                    {activeTab === "info" && !isEditing && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                            disabled={isSubmitting}
                                            className="mt-2 bg-schoMetricsBaseColor border-none hover:bg-schoMetricsBaseColor/80 hover:text-white cursor-pointer text-white"
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar Información
                                        </Button>
                                    )}
                                    {activeTab === "info" && isEditing && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                                className="bg-blue-50 text-schoMetricsBaseColor hover:text-schoMetricsBaseColor cursor-pointer"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Cancelar
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-schoMetricsBaseColor hover:bg-schoMetricsBaseColor/80 cursor-pointer"
                                                onClick={handleSave}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="mr-2 h-4 w-4" />
                                                )}
                                                Guardar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <TabsList className="grid w-max grid-cols-2 bg-blue-300" id="profile_tabs">
                                    <TabsTrigger className="cursor-pointer data-[state=active]:text-blue-700 not-[state=active]:text-white" value="info">Información</TabsTrigger>
                                    <TabsTrigger className="cursor-pointer data-[state=active]:text-blue-700 not-[state=active]:text-white" value="security">Seguridad</TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent>
                                <TabsContent value="info" className="space-y-6">
                                    {isEditing ? (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-sm font-semibold text-blue-400">
                                                    Correo electrónico (Institucional o Personal)
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                    className="bg-white border-blue-300"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="postalCode" className="text-sm font-semibold text-blue-400">
                                                    Código Postal
                                                </Label>
                                                <Input
                                                    id="postalCode"
                                                    name="postalCode"
                                                    type="number"
                                                    value={formData.postalCode}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                    required
                                                    className="w-max bg-white border-blue-300"
                                                    placeholder="Código Postal"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="address" className="text-sm font-semibold text-blue-400">
                                                    Dirección
                                                </Label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                    required
                                                    placeholder="Avenida Univesidad 1234, Col. Progreso, Cuernavaca; Morelos 6200"
                                                    className="bg-white border-blue-300"

                                                />
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="city" className="text-sm font-semibold text-blue-400">
                                                        Ciudad
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                        required
                                                        placeholder="Ciudad"
                                                        className="bg-white border-blue-300"

                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-max">
                                                <Label htmlFor="state" className="text-sm font-semibold text-blue-400">
                                                    Estado <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.state}
                                                    onValueChange={(value) =>
                                                        handleStateChange(value as MexicanState | "")
                                                    }
                                                    disabled={isSubmitting}
                                                >
                                                    <SelectTrigger id="state" className="bg-white cursor-pointer">
                                                        <SelectValue placeholder="Selecciona un estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Estados de México</SelectLabel>
                                                            {MEXICAN_STATES.map((stateName) => (
                                                                <SelectItem key={stateName} value={stateName} className="hover:bg-blue-100 cursor-pointer">
                                                                    {stateName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <h3 className="flex items-center gap-2 font-medium text-zinc-500">
                                                    Nombre completo
                                                </h3>
                                                <p className="uppercase text-blue-600 font-semibold">{profile.name}</p>
                                            </div>

                                            {profile.profile?.email && (
                                                <div className="space-y-1">
                                                    <h3 className="font-medium text-zinc-500">Correo electrónico</h3>
                                                    <p className="overflow-auto text-blue-600 font-semibold">
                                                        {profile.profile.email}
                                                    </p>
                                                </div>
                                            )}

                                            {
                                                profile.userType === "SCHOOL" ? (
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium text-zinc-500">Clave de Centro de Trabajo (CCT)</h3>
                                                        <p className="text-blue-600 font-semibold">
                                                            {profile.profile?.cct}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium text-zinc-500">Clave de Registro Federal (RFC)</h3>
                                                        <p className="text-blue-600 font-semibold">
                                                            {profile.profile?.rfc}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-zinc-500">Ciudad y Estado</h3>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {
                                                        <div className="flex items-start gap-2">
                                                            <div className="text-blue-600 font-semibold">
                                                                <p>{profile.profile?.city}</p>
                                                                <p>{profile.profile?.state}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-zinc-500">Código Postal</h3>
                                                <p className="text-blue-600 font-semibold">
                                                    {profile.profile?.postalCode}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-zinc-500">Dirección</h3>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex items-start gap-2">
                                                        <div className="text-blue-600 font-semibold">
                                                            <p>{profile.profile?.address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </TabsContent>
                                <TabsContent value="security">
                                    <ChangePasswordForm />
                                    {/* <div className="space-y-6"><div className="space-y-2"><h3 className="font-medium">Cambiar contraseña</h3><p className="text-sm text-muted-foreground">Actualiza tu contraseña para mantener tu cuenta segura</p></div><div className="grid gap-4"><div className="grid gap-2"><Label htmlFor="current-password">Contraseña actual</Label><Input id="current-password" type="password" /></div><div className="grid gap-2"><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" type="password" /></div><div className="grid gap-2"><Label htmlFor="confirm-password">Confirmar nueva</Label><Input id="confirm-password" type="password" /></div></div><Button className="bg-green-600 hover:bg-green-700">Actualizar contraseña</Button></div> */}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
}
