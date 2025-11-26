"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { es } from "date-fns/locale"; // Import es locale
import { User, Edit, Camera, Save, X, Trash2, Loader2, Users, ArrowLeftRight, Settings, CheckCircle, ArrowRightLeftIcon, CalendarCheckIcon } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge"; // Kept as UiBadge to avoid conflict if you use a 'Badge' component
import { validateAvatarFile } from "@/lib/supabase-service"; // Assuming this path is correct
import toast from "react-hot-toast"; // Using react-hot-toast as per your original code
import { useParams, useRouter } from 'next/navigation';
import { Label } from "@radix-ui/react-label";
import {
    Tabs
} from "@/components/ui/tabs";
import AdminDeleteUser from "../../components/AdminDeleteUser";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import LoaderCircle from "@/app/components/LoaderCircle";
import { AllDataUser } from "@/types/types";
import { MEXICAN_STATES, MexicanState } from "@/lib/constants";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminViewPublishedRecyclableMaterials from "../components/AdminViewPublishedRecyclableMaterials";
import AdminViewPurchasedMaterialsPage from "../components/AdminViewPurschasedList";
import { AdminNavigation } from "@/app/components/admin/AdminNavigation";
import { StripeConnectManagement } from "@/app/components/admin/StripeConnectManagement";
import { getInitials } from "@/hooks/getInitials";

export default function ProfilePage() {
    const params = useParams();
    const userId = params.userId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<AllDataUser | null>(null); // Initialize as null
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        // identifier: "",
        email: "",
        city: "",
        state: "",
        postalCode: "",
        rfc: "",
        cct: "",
        phone: "",
    });

    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
        null,
    );
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState("info"); // Para manejar la pestaña activa

    useEffect(() => {
        fetchProfileData();
    }, [userId]);

    const fetchProfileData = async () => {
        // setIsLoading(true) will be handled by the main isLoading state
        try {
            const response = await fetch(`/api/admin/users/profiles/${userId}`);
            if (!response.ok) throw new Error("Error al obtener perfil");
            const data: AllDataUser = await response.json();
            setUser(data);
            setFormData({
                name: data.name || "",
                // identifier: data.identifier || "",
                email: data.profile?.email || "",
                city: data.profile?.city || "",
                state: data.profile?.state || "",
                postalCode: data.profile?.postalCode || "",
                rfc: data.profile?.rfc || "",
                cct: data.profile?.cct || "",
                phone: data.profile?.phone || "",
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
        // payload.append("identifier", formData.identifier);
        payload.append("city", formData.city);
        payload.append("state", formData.state);
        payload.append("postalCode", formData.postalCode);
        payload.append("rfc", formData.rfc);
        payload.append("cct", formData.cct);
        payload.append("phone", formData.phone);
        if (selectedAvatarFile) payload.append("avatarFile", selectedAvatarFile);

        try {
            const response = await fetch(`/api/admin/users/profiles/${userId}`, {
                method: "PUT",
                body: payload,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar perfil");
            }
            const updatedProfile: AllDataUser = await response.json();
            setUser(updatedProfile);
            // Actualizar formData con los datos del perfil actualizado
            setFormData({
                name: updatedProfile.name || "",
                email: updatedProfile.profile?.email || "",
                // identifier: updatedProfile.identifier || "",
                city: updatedProfile.profile?.city || "",
                state: updatedProfile.profile?.state || "",
                postalCode: updatedProfile.profile?.postalCode || "",
                rfc: updatedProfile.profile?.rfc || "",
                cct: updatedProfile.profile?.cct || "",
                phone: updatedProfile.profile?.phone || "",
            });
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setIsEditing(false);
            toast.success("Perfil actualizado actualizado correctamente.");
            router.refresh();
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
        if (!user?.profile?.publicAvatarDisplayUrl) {
            toast.error("No hay foto de perfil para eliminar.");
            return;
        }
        setIsSubmitting(true);
        const payload = new FormData();
        // Enviar los datos actuales del formulario para no perderlos si solo se borra el avatar
        Object.entries(formData).forEach(([key, value]) =>
            payload.append(key, value as string),
        );
        payload.append("deleteAvatar", "true");

        try {
            const response = await fetch(`/api/admin/users/profiles/${userId}`, {
                method: "PUT",
                body: payload,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Error al eliminar la foto de perfil",
                );
            }
            const updatedProfile: AllDataUser = await response.json();
            setUser(updatedProfile);
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.success(
                "Foto de perfil eliminada. Tu foto de perfil ha sido eliminada.",
            );
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

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.profile?.email || "",
                // identifier: user.identifier || "",
                city: user.profile?.city || "",
                state: user.profile?.state || "",
                postalCode: user.profile?.postalCode || "",
                rfc: user.profile?.rfc || "",
                cct: user.profile?.cct || "",
                phone: user.profile?.phone || "",
            });
        }
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsEditing(false);
    };

    const handleStateChange = (value: MexicanState | "") => {
        setFormData((prev) => ({ ...prev, state: value }));
    };

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
        <div className="min-h-screen bg-black">
            <AdminNavigation />
            <LoaderCircle />
        </div>
    }
    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium">No se pudo cargar el perfil</h3>
                <p className="mt-1 text-muted-foreground">
                    Intenta recargar la página.
                </p>
                <Button onClick={fetchProfileData} className="mt-5 cursor-pointer hover:bg-slate-700">Reintentar</Button>
            </div>
        );
    }

    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
        }
        return format(date, "dd MMM, yyyy", { locale: es });
    };

    const USER_TYPE_MAP: { [key: string]: string } = {
        SELLER: "Vendedor",
        BUYER: "Comprador",
        ADMIN: "Administrador",
    };

    return (
        <div className="min-h-screen bg-black">
            <AdminNavigation />
            {AvatarInput()}
            <div className="m-5 flex flex-col gap-8 sm:m-10">
                <div className="mt-10 flex flex-col gap-2 rounded-xl bg-linear-to-r from-rose-700 to-red-800 p-6 text-white shadow-lg lg:mt-0">
                    <div className="flex flex-col items-center justify-between gap-2 lg:flex-row lg:justify-between">
                        <div className="my-3">
                            <div className="flex items-center gap-3">
                                <Users className="h-8 w-8" />
                                <h1 className="text-3xl font-bold tracking-wide">
                                    Edita o Elimina Usuarios
                                </h1>
                            </div>
                            <p className="tracking-wide text-purple-100">
                                Edita la información o Elimina Usuarios que ya no tendrán
                                participación en SchoMetrics.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Link href="/admin/lista-de-usuarios/">
                        <Button className="bg-rose-700 hover:bg-rose-800 cursor-pointer">
                            <ArrowLeftRight />
                            Volver
                        </Button>
                    </Link>
                </div>
            </div>

            {/* =========================================================================================== */}

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 mt-10">
                    <div className="mb-4 flex flex-col items-center justify-center md:flex-row">
                        <Settings className="mr-3 h-12 w-12 animate-spin text-schoMetricsBaseColor" />
                        <h1 className="text-3xl font-bold text-schoMetricsBaseColor">
                            SchoMetrics
                        </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center px-2 pt-5">
                        <ul className="flex flex-col gap-5">
                            <li className="">
                                <a
                                    href="#delete_user"
                                    className="flex flex-col items-center justify-center gap-2 text-center md:flex-row text-zinc-300"
                                >
                                    <Trash2 className="mr-3 h-5 w-5 animate-heartbeat text-rose-700" />
                                    Elimina Usuarios que ya no tendrán participación en
                                    SchoMetrics
                                </a>
                            </li>
                            <li className="">
                                <a
                                    href="#edit_info"
                                    className="flex flex-col items-center justify-center gap-2 text-center md:flex-row text-zinc-300"
                                >
                                    <Edit className="mr-3 h-5 w-5 animate-heartbeat text-blue-700" />
                                    Edita la información del Usuario
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="m-2 mb-6 flex justify-center">
                    <div className="flex items-center justify-center gap-1 border-b-2 border-b-red-600 px-4 py-2 text-sm font-semibold text-rose-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Comprueba la autenticidad de la información
                    </div>
                </div>

                {/* Main Card */}
                <Card className="m-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-teal-950 to-sky-950 text-white rounded-t-xl">
                        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
                            <div className="flex flex-col gap-2 text-sky-50">
                                <CardTitle className="flex items-center text-center text-xl">
                                    <User className="mr-2 h-6 w-6" />
                                    Información del Usuario
                                </CardTitle>
                                <CardDescription className="text-center tracking-wider text-rose-50">
                                    Aquí encontrarás los datos Globales del Usuario.
                                </CardDescription>
                            </div>
                            <div className="mt-5 rounded-full bg-white p-1">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={user?.profile?.publicAvatarDisplayUrl || ""}
                                        alt={user?.name || "Avatar"}
                                    />
                                    <AvatarFallback className="bg-rose-100 text-[25px] font-semibold text-rose-600">
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Información Personal */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-2 text-lg font-semibold text-rose-900">
                                    Datos Personales Básicos
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Nombre Completo:
                                        </label>
                                        <p className="text-lg font-medium text-gray-900">
                                            {user?.name.toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            ID de Usuario:
                                        </label>
                                        <p className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                                            {user?.id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Identificador de Cuenta:
                                        </label>
                                        <p className="text-lg font-bold text-sky-800">
                                            {user?.identifier}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Tipo de Cuenta:{" "}
                                        </label>
                                        <Badge
                                            variant={
                                                user?.userType === "SELLER"
                                                    ? "secondary"
                                                    : user?.userType === "BUYER"
                                                        ? "outline"
                                                        : user?.userType === "ADMIN"
                                                            ? "outline" // Example: use outline for community
                                                            : "default"
                                            }
                                            className={
                                                user?.userType === "SELLER"
                                                    ? "border-sky-300 bg-sky-100 text-sky-700"
                                                    : user?.userType === "BUYER"
                                                        ? "border-green-300 bg-green-100 text-green-700"
                                                        : user?.userType === "ADMIN"
                                                            ? "bg-red-950 text-white"
                                                            : "border-gray-300 bg-gray-100 text-gray-700"
                                            }
                                        >
                                            {USER_TYPE_MAP[user?.userType as string] ||
                                                user?.userType}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col items-start gap-2 text-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <CalendarCheckIcon className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-sm font-medium text-gray-500">
                                                Miembro desde:
                                            </span>
                                        </div>
                                        <span className="font-semibold">
                                            {formatDate(user.createdAt, false)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {
                            user.userType === "SELLER" && (
                                <AdminViewPublishedRecyclableMaterials userId={user?.id as string} />
                            )
                        }
                        {/* CHANGE: Added Stripe Connect Management for SELLER users */}
                        {
                            user.userType === "SELLER" && (
                                <div className="mt-6">
                                    <StripeConnectManagement userId={user?.id as string} />
                                </div>
                            )
                        }
                        {
                            user.userType === "BUYER" && (
                                <AdminViewPurchasedMaterialsPage userId={user?.id as string} />
                            )
                        }
                        {
                            user.userType === "ADMIN" && (
                                <>
                                    <AdminViewPublishedRecyclableMaterials userId={user?.id as string} />
                                    <AdminViewPurchasedMaterialsPage userId={user?.id as string} />
                                </>
                            )
                        }

                        <Separator className="my-6" />
                        <div className="flex w-full flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold text-rose-900">
                                Acciones Disponibles
                            </h2>
                            <div className="mt-5 flex flex-col items-center justify-center gap-5 p-2 md:flex-row md:items-center md:justify-around">
                                {/* Eliminar Usuario */}
                                <div className="flex w-full items-center justify-center">
                                    <div
                                        id="delete_user"
                                        className="flex w-[300px] flex-col items-center justify-center rounded-md border-2 border-dashed border-red-600 p-4 transition-all duration-300 ease-in-out hover:border-dotted"
                                    >
                                        <h2 className="font-semibold text-red-600">
                                            Zona de Peligro
                                        </h2>
                                        <p className="my-4 text-center text-gray-500">
                                            Aquí podrás eliminar la cuenta de esté Usuario, está
                                            acción es irreversible, se eliminará toda la información
                                            asociada al Usuario.
                                        </p>
                                        <AdminDeleteUser userId={user?.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardContent>
                        <Separator className="my-6" />
                        {/* Editar Información */}
                        <h3
                            id="edit_info"
                            className="w-max border-b pb-2 text-lg font-semibold text-blue-900"
                        >
                            Información General del Usuario
                        </h3>

                        <Card className="md:col-span mt-5 border-none bg-black p-4 shadow-md shadow-zinc-600 text-white">
                            {" "}
                            {/* Ajustado para que las pestañas ocupen 2 columnas en md y más grandes */}
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <CardHeader>
                                    <div className="flex flex-col items-center justify-between gap-2 pb-2">
                                        {" "}
                                        {/* Reducido mb */}
                                        {/* <CardTitle>Detalles de la Cuenta</CardTitle> */}
                                        {activeTab === "info" && !isEditing && (
                                            <div className="flex w-[250px] flex-col items-center justify-center rounded-md border-2 border-dashed border-sky-500 p-4 transition-all duration-300 ease-in-out hover:border-dotted">
                                                <Button
                                                    size="sm"
                                                    onClick={() => setIsEditing(true)}
                                                    disabled={isSubmitting}
                                                    className="bg-sky-500 hover:bg-sky-600 cursor-pointer"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar Información
                                                </Button>
                                            </div>
                                        )}
                                        {activeTab === "info" && isEditing && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCancel}
                                                    disabled={isSubmitting}
                                                    className="bg-sky-50 hover:bg-sky-100 text-black hover:text-sky-600 cursor-pointer"
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
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
                                    {/* Editar Foto de Perfil */}
                                    <CardHeader className="relative">
                                        <div className="flex flex-col items-center">
                                            <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        src={
                                                            avatarPreviewUrl ||
                                                            user.profile?.publicAvatarDisplayUrl ||
                                                            ""
                                                            || "/placeholder.svg"}
                                                        alt={user.name || "Avatar"}
                                                    />
                                                    <AvatarFallback className="bg-rose-100 text-2xl font-semibold uppercase text-rose-600">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isEditing && ( // Mostrar botón de cámara solo en modo edición
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute bottom-0 right-0 rounded-full bg-background border-none"
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
                                                user.profile?.publicAvatarDisplayUrl &&
                                                !avatarPreviewUrl && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-2 text-red-500 hover:text-red-700"
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
                                                    Nueva foto seleccionada (Da clic en Guardar para
                                                    aplicar)
                                                </p>
                                            )}
                                            {!isEditing && (
                                                <p className="mt-4 px-5 text-center text-xs text-zinc-300 lg:px-10">
                                                    Para cambiar la foto de Perfil da clic en "Editar
                                                    Información" y luego en "Guardar".
                                                </p>
                                            )}
                                        </div>
                                    </CardHeader>
                                </CardHeader>
                                <CardContent className="">
                                    {isEditing ? (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name" className="text-md font-medium text-blue-500">
                                                    Nombre completo
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                    className="uppercase"
                                                />
                                            </div>
                                            {/* <div className="grid gap-2">
                                                <Label
                                                    htmlFor="identifier"
                                                    className="text-sm font-medium"
                                                >
                                                    Identificador de Sesión (Único e Irrepetible)
                                                </Label>
                                                <Input
                                                    id="identifier"
                                                    name="identifier"
                                                    value={formData.identifier}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                    className="uppercase"
                                                />
                                            </div> */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-md font-medium text-blue-500"
                                                >
                                                    Correo electrónico (Institucional o Personal)
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="city"
                                                        className="text-md font-medium text-blue-500"
                                                    >
                                                        Ciudad
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-max">
                                                <Label htmlFor="state" className="text-md font-medium text-blue-500">
                                                    Estado <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.state}
                                                    onValueChange={(value) =>
                                                        handleStateChange(value as MexicanState | "")
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger id="state">
                                                        <SelectValue placeholder="Selecciona un estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Estados de México</SelectLabel>
                                                            {MEXICAN_STATES.map((stateName) => (
                                                                <SelectItem key={stateName} value={stateName}>
                                                                    {stateName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="postalCode"
                                                        className="text-md font-medium text-blue-500"
                                                    >
                                                        Código Postal
                                                    </Label>
                                                    <Input
                                                        id="postalCode"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="rfc"
                                                        className="text-md font-medium text-blue-500"
                                                    >
                                                        RFC
                                                    </Label>
                                                    <Input
                                                        id="rfc"
                                                        name="rfc"
                                                        value={formData.rfc}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="cct"
                                                        className="text-md font-medium text-blue-500"
                                                    >
                                                        CCT
                                                    </Label>
                                                    <Input
                                                        id="cct"
                                                        name="cct"
                                                        value={formData.cct}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="phone"
                                                        className="text-md font-medium text-blue-500"
                                                    >
                                                        Teléfono
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <h3 className="flex items-center gap-2 font-medium text-sky-500">
                                                    Nombre completo
                                                </h3>
                                                <p className="uppercase text-muted-foreground">
                                                    {user.name}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="flex items-center gap-2 font-medium text-sky-500">
                                                    Identificador de Cuenta
                                                </h3>
                                                <p className="uppercase text-muted-foreground">
                                                    {user.identifier}
                                                </p>
                                            </div>
                                            {user.profile?.email && (
                                                <div className="space-y-1">
                                                    <h3 className="font-medium text-sky-500">
                                                        Correo electrónico
                                                    </h3>
                                                    <p className="overflow-auto text-muted-foreground">
                                                        {user.profile.email}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-sky-500">
                                                    Ciudad y Estado
                                                </h3>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {
                                                        <div className="flex items-start gap-2">
                                                            <div className="text-muted-foreground">
                                                                <p>{user.profile?.city || "No tiene"} </p>
                                                                <p>{user.profile?.state || "No tiene"} </p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-sky-500">
                                                    Código Postal
                                                </h3>
                                                <p className="overflow-auto text-muted-foreground">
                                                    {user.profile?.postalCode || "No tiene"}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-sky-500">
                                                    RFC
                                                </h3>
                                                <p className="overflow-auto text-muted-foreground">
                                                    {user.profile?.rfc || "No tiene"}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-sky-500">
                                                    CCT
                                                </h3>
                                                <p className="overflow-auto text-muted-foreground">
                                                    {user.profile?.cct || "No tiene"}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <h3 className="mb-2 font-medium text-sky-500">
                                                    Teléfono
                                                </h3>
                                                <p className="overflow-auto text-muted-foreground">{user.profile?.phone || "No tiene"}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Tabs>
                        </Card>

                        {/* Footer Information */}
                        <div className="mt-5 rounded-lg bg-gray-50 p-4">
                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="text-center text-xs text-gray-500">
                                    Recuerda verificar los datos modificados antés de enviar el
                                    formulario.
                                    <br />
                                    La acción de Eliminar Usuario es irreversible, recuerda usarla
                                    con precaución.
                                </p>
                            </div>
                        </div>
                        <div className="my-5 flex w-full items-center justify-center">
                            <Link href="/admin/lista-de-usuarios/">
                                <Button className="w-max bg-rose-700 hover:bg-rose-800 cursor-pointer">
                                    <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
                                    Regresar
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} SchoMetrics.
                    </p>
                </div>
            </div>
        </div>
    );
}
