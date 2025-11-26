"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X, Upload, BoxIcon, Edit, Package, ClipboardCheck } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/legacy/image";
import {
    ALLOWED_IMAGE_TYPES,
    MAX_FILES,
    MIN_FILES,
    MAX_FILE_SIZE,
} from "@/types/types-supabase-service";
import { MEXICAN_STATES, MexicanState } from "@/lib/constants";
import LoaderCircle from "@/app/components/LoaderCircle";
import { SellerUserProfileData } from "@/types/types";
import useUserSession from "@/hooks/useUserSession";
import Link from "next/link";
import { MaterialType, UserType } from "@/generated/prisma/enums";


// Crear una lista de los valores para mostrarla en el mensaje
const validMaterials = Object.values(MaterialType).join(", ");
// Esquema de validación Zod para el frontend
const RecyclableMaterialFormSchemaClient = z.object({
    title: z.string().min(20, "El título debe tener al menos 20 caracteres").max(200, "El título no debe exceder 200 caracteres"),
    materialType: z.nativeEnum(MaterialType, {
        errorMap: (issue, ctx) => {
            // Aquí personalizamos el mensaje
            return {
                message: `Tipo de material inválido. Los materiales esperados son: ${validMaterials}`
            };
        },
    }),
    quantity: z.coerce
        .number()
        .positive({ message: "La cantidad debe ser mayor a 0" })
        .min(50, "La cantidad debe ser mayor a 50 Kg")
        .max(2000, "La cantidad no debe exceder 2000 Kg"),
    city: z.string().min(1, "Debes ingresar una ciudad"),
    state: z.string().min(1, "Debes ingresar un estado"),
    postalCode: z.string().min(5, "El código postal debe tener al menos 5 caracteres").max(5, "El código postal debe tener 5 caracteres"),
    address: z.string().min(1, "Debes ingresar una dirección"),
    location: z.string().min(1, "Debes ingresar una dirección de Google Maps válida"),
    schedule: z.string().min(1, "Debes ingresar un horario"),
    images: z
        .array(z.instanceof(File))
        .min(MIN_FILES, `Debes subir al menos ${MIN_FILES} imagen.`)
        .max(MAX_FILES, `Puedes subir un máximo de ${MAX_FILES} imágenes.`)
        .refine(
            (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
            `La imagen seleccionada excede el tamaño máximo permitido de ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        )
        .refine(
            (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
            "Alguna imagen tiene un tipo de archivo no permitido (JPG, PNG, WEBP).",
        ),
});

type RecyclableMaterialFormClientData = z.infer<
    typeof RecyclableMaterialFormSchemaClient
>;
type RecyclableMaterialFormErrors = Partial<
    Record<keyof RecyclableMaterialFormClientData, string>
>;



export default function NewRecyclableMaterialForm() {
    const router = useRouter();
    const { session, isLoadingSession } = useUserSession();
    const [completeProfile, setCompleteProfile] = useState<SellerUserProfileData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormDataState] = useState<
        Omit<RecyclableMaterialFormClientData, "images"> & { images: File[] }
    >({
        title: "",
        materialType: "" as MaterialType, // Valor por defecto
        quantity: 0,
        city: "",
        state: "",
        postalCode: "",
        schedule: "",
        address: "",
        location: "",
        images: [],
    });
    const [errors, setErrors] = useState<RecyclableMaterialFormErrors>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCompleteProfile();
    }, [session]);


    const fetchCompleteProfile = async () => {
        try {
            const res = await fetch("/api/seller/profile");
            if (res.ok) {
                const data = await res.json();
                setCompleteProfile(data);
            } else {
                setCompleteProfile(null);
            }
        } catch (error) {
            console.error("Error fetching complete profile:", error);
            setCompleteProfile(null);
        }
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormDataState((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof RecyclableMaterialFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };
    const handleMaterialTypeChange = (value: string) => {
        setFormDataState((prev) => ({
            ...prev,
            materialType: value as MaterialType,
        }));
        if (errors.materialType) setErrors((prev) => ({ ...prev, materialType: undefined }));
    };

    const handleStateChange = (value: MexicanState | "") => {
        setFormDataState((prev) => ({ ...prev, state: value }));
        if (errors.state) {
            setErrors((prev) => ({ ...prev, state: undefined }));
        }
    };

    const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesArray = Array.from(e.target.files || []);
        if (filesArray.length === 0) return;

        const currentTotalFiles = formData.images.length + filesArray.length;
        if (currentTotalFiles > MAX_FILES) {
            setErrors((prev) => ({
                ...prev,
                images: `No puedes subir más de ${MAX_FILES} imágenes.`,
            }));
            if (imageInputRef.current) imageInputRef.current.value = "";
            return;
        }

        const newImageFiles = [...formData.images, ...filesArray];
        const validationResult =
            RecyclableMaterialFormSchemaClient.shape.images.safeParse(newImageFiles);

        if (!validationResult.success) {
            setErrors((prev) => ({
                ...prev,
                images: validationResult.error.issues[0].message,
            }));
            if (imageInputRef.current) imageInputRef.current.value = "";
            return;
        }

        setFormDataState((prev) => ({ ...prev, images: newImageFiles }));
        const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setErrors((prev) => ({ ...prev, images: undefined }));
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const removeImageFile = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setFormDataState((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        // Re-validar o limpiar errores de cantidad si es necesario
        if (
            formData.images.length - 1 < MAX_FILES &&
            errors.images?.includes("máximo")
        ) {
            setErrors((prev) => ({ ...prev, images: undefined }));
        }
        if (
            formData.images.length - 1 >= MIN_FILES &&
            errors.images?.includes("al menos")
        ) {
            setErrors((prev) => ({ ...prev, images: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const validationResult = RecyclableMaterialFormSchemaClient.safeParse(formData);
        if (!validationResult.success) {
            const newErrors: RecyclableMaterialFormErrors = {};
            validationResult.error.errors.forEach((err) => {
                newErrors[err.path[0] as keyof RecyclableMaterialFormClientData] =
                    err.message;
            });
            setErrors(newErrors);
            toast.error("Por favor, corrige los errores en el formulario.");
            setIsSubmitting(false);
            return;
        }

        const apiFormData = new FormData();
        apiFormData.append("title", formData.title);
        apiFormData.append("materialType", formData.materialType);
        apiFormData.append("quantity", formData.quantity.toString());
        apiFormData.append("city", formData.city);
        apiFormData.append("state", formData.state);
        apiFormData.append("postalCode", formData.postalCode);
        apiFormData.append("schedule", formData.schedule);
        apiFormData.append("address", formData.address);
        apiFormData.append("location", formData.location);
        formData.images.forEach((file, index) => {
            apiFormData.append(`images[${index}]`, file);
        });

        try {
            const response = await fetch("/api/seller/recyclable-materials", {
                method: "POST",
                body: apiFormData, // FormData se envía directamente
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear el material reciclable");
            }
            toast.success("Material reciclable creado exitosamente!");
            router.push(`/vendedor/materiales-publicados`); // Redirigir a la pestaña de materiales publicados
            router.refresh();
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error desconocido al crear material reciclable.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingSession) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoaderCircle />
            </div>
        );
    }
    if (
        !session ||
        (session.userType !== UserType.SELLER &&
            session.userType !== UserType.ADMIN)
    ) {
        return (
            <div className="container mx-auto p-4 text-center">
                Acceso Denegado.
            </div>
        );
    }

    const recyclableMaterialArray = Object.values(MaterialType);

    return (
        <div className="min-h-screen">
            {
                completeProfile?.name === null || completeProfile?.profile?.email === null || completeProfile?.profile?.phone === null || completeProfile?.profile?.address === null || completeProfile?.profile?.city === null || completeProfile?.profile?.state === null || completeProfile?.profile?.postalCode === null || completeProfile?.profile?.rfc === null || completeProfile?.profile?.cct === null ?
                    (
                        <div className="flex flex-col justify-center items-center">
                            <Card className="my-10">
                                <CardHeader>
                                    <div className="mb-2 flex items-center gap-3">
                                        <Edit className="h-7 w-7 text-lime-600 animate-heartbeat" />
                                        <CardTitle className="text-2xl font-semibold">
                                            ¡ Completa tu perfil !
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <span>
                                        Para publicar un material reciclable, el <b className="text-lime-600">Perfil</b> debe estar completo. Asegúrate de tener la siguiente información completa:
                                    </span>
                                    <ul className="list-disc pl-10 text-zinc-400 font-semibold">
                                        <li>Correo electrónico: {" "}
                                            {
                                                completeProfile?.profile?.email === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.email})</b>
                                                    )
                                            }
                                        </li>
                                        <li>Teléfono: {" "}
                                            {
                                                completeProfile?.profile?.phone === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.phone})</b>
                                                    )
                                            }
                                        </li>
                                        <li>Dirección: {" "}
                                            {
                                                completeProfile?.profile?.address === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.address})</b>
                                                    )
                                            }
                                        </li>
                                        <li>Ciudad: {" "}
                                            {
                                                completeProfile?.profile?.city === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.city})</b>
                                                    )
                                            }
                                        </li>
                                        <li>Estado: {" "}
                                            {
                                                completeProfile?.profile?.state === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.state})</b>
                                                    )
                                            }
                                        </li>
                                        <li>Código Postal: {" "}
                                            {
                                                completeProfile?.profile?.postalCode === null ?
                                                    (
                                                        (<b className="text-red-500">No Completado</b>)
                                                    ) : (
                                                        <b className="text-green-500">({completeProfile?.profile?.postalCode})</b>
                                                    )
                                            }
                                        </li>
                                    </ul>
                                    <div className="flex flex-col w-full space-y-2">
                                        <span>
                                            Puedes completar o editar la información desde la sección de <b className="text-lime-600 font-semibold">Mi Perfil</b> dando click en el botón:
                                        </span>
                                        <Link href="/vendedor/perfil">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer bg-schoMetricsBaseColor hover:bg-schoMetricsBaseColor/80 border-none hover:text-white text-white w-max"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar Información
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    ) : (

                        <Card className="container mx-auto max-w-3xl my-10 bg-white border-green-600 border-2 shadow-xl shadow-green-100 rounded-2xl hover:shadow-emerald-300 transition-all ease-linear duration-500">
                            <Card className="w-full bg-green-600 rounded-t-xl rounded-b-none border-lime-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lime-50 text-xl">
                                        <Package size={24} />
                                        ¡ Es importante preparar los materiales !
                                    </CardTitle>
                                    <CardDescription className="text-white">
                                        Una correcta separación y limpieza no solo facilita la venta, sino que también
                                        aumenta el valor de tus materiales y apoya un reciclaje más eficiente.
                                    </CardDescription>
                                    <Link
                                        href="/vendedor/tratamiento-del-material"
                                        title="Tratamiento del Material"
                                        className="mt-2 p-2 bg-white text-orange-600 w-full rounded-md flex flex-col text-center justify-center items-center gap-2 hover:bg-orange-600 hover:text-white transition-colors md:flex-row md:items-center md:w-max"
                                    >
                                        <ClipboardCheck className="h-6 w-6 animate-bounce" />
                                        Revisa aquí las recomendaciones de separación y tratamiento
                                    </Link>
                                </CardHeader>
                            </Card>

                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <BoxIcon className="h-7 w-7 text-lime-600 animate-spin" />
                                    <CardTitle className="text-2xl font-semibold">
                                        Crear Nuevo Material Reciclable
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-zinc-400">
                                    Completa la información para publicar tu material reciclable.
                                </CardDescription>
                            </CardHeader >

                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6">
                                    {/* Título */}
                                    <div className="space-y-1">
                                        <Label htmlFor="title">
                                            Título de la Publicación{" "}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Disponibilidad de 100 kg de material PET"
                                            disabled={isSubmitting}
                                            className={errors.title ? "border-red-500" : ""}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>
                                    {/* Tipo de Material */}
                                    <div className="space-y-1">
                                        <Label htmlFor="materialType">
                                            Tipos de Materiales <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.materialType}
                                            onValueChange={handleMaterialTypeChange}
                                            name="materialType"
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger
                                                id="materialType"
                                                name="materialType"
                                                className={errors.materialType ? "border-red-500" : "cursor-pointer"}
                                            >
                                                <SelectValue placeholder="Selecciona un Tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Temas de Material Reciclable</SelectLabel>
                                                    {recyclableMaterialArray.map((materialTypeValue) => (
                                                        <SelectItem key={materialTypeValue} value={materialTypeValue} className="cursor-pointer hover:bg-gray-100">
                                                            {materialTypeValue
                                                                .replace(/_/g, " ")
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                materialTypeValue
                                                                    .replace(/_/g, " ")
                                                                    .slice(1)
                                                                    .toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.materialType && (
                                            <p className="text-sm text-red-500">{errors.materialType}</p>
                                        )}
                                    </div>

                                    {/* Cantidad */}
                                    <div className="space-y-1 w-max">
                                        <Label htmlFor="quantity">
                                            Cantidad de Material (Kg) <span className="text-red-500">*</span>
                                        </Label>
                                        {/* Verificar que solo se puedan ingresar números enteros/decimales */}
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            step="0.1"
                                            min="50"
                                            max="2000"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 150"
                                            disabled={isSubmitting}
                                            onKeyDown={(e) => {
                                                if (
                                                    !/[0-9]/.test(e.key) &&
                                                    e.key !== "Backspace" &&
                                                    e.key !== "Delete"
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={errors.quantity ? "border-red-500" : ""}
                                        />
                                        {errors.quantity && (
                                            <p className="text-sm text-red-500">{errors.quantity}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Ciudad */}
                                        <div className="space-y-2">
                                            <Label htmlFor="city">
                                                Ciudad <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Cuernavaca"
                                                disabled={isSubmitting}
                                            />
                                            {errors.city && (
                                                <p className="text-sm text-red-500">{errors.city}</p>
                                            )}
                                        </div>
                                        {/* Estado */}
                                        <div className="space-y-2">
                                            <Label htmlFor="state">
                                                Estado <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={formData.state}
                                                onValueChange={(value) =>
                                                    handleStateChange(value as MexicanState | "")
                                                }
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger id="state" className="cursor-pointer">
                                                    <SelectValue placeholder="Selecciona un estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Estados de México</SelectLabel>
                                                        {MEXICAN_STATES.map((stateName) => (
                                                            <SelectItem key={stateName} value={stateName} className="cursor-pointer hover:bg-gray-100">
                                                                {stateName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.state && (
                                                <p className="text-sm text-red-500">{errors.state}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Código Postal */}
                                        <div className="space-y-1">
                                            <Label htmlFor="postalCode">
                                                Código Postal{" "}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="postalCode"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 62000"
                                                disabled={isSubmitting}
                                                className={errors.postalCode ? "border-red-500" : ""}
                                            />
                                            {errors.postalCode && (
                                                <p className="text-sm text-red-500">{errors.postalCode}</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Dirección Completa */}
                                    <div className="space-y-1">
                                        <Label htmlFor="address">
                                            Dirección Completa{" "}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Calle, Número, Colonia"
                                            disabled={isSubmitting}
                                            className={errors.address ? "border-red-500" : ""}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    {/* Ubicación Geográfica */}
                                    <h3 className="text-md mt-4 border-t pt-2 font-semibold">
                                        Ubicación Geográfica
                                    </h3>
                                    <div className="w-full">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">
                                                Link de Google Maps <span className="text-red-500">*</span>
                                            </Label>
                                            <p className="text-xs text-green-600">
                                                Puedes obtener el link de ubicación desde Google Maps (clic
                                                derecho sobre el mapa &gt; "Compartir esta ubicación" da clic en "COPIAR VÍNCULO" y colócalo aquí).
                                                <b>
                                                    {" "}Recuerda que es importante proporcionar una ubicación exacta para facilitar el traslado del Trasportista que hará la recolección de la compra.
                                                </b>
                                            </p>
                                            <Input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="Ej: https://maps.app.goo.gl/tfEKhbwrmKNeXJ6r9"
                                                disabled={isSubmitting}
                                            />
                                            {errors.location && (
                                                <p className="text-sm text-red-500">{errors.location}</p>
                                            )}
                                        </div>
                                    </div>


                                    {/* Horarios */}
                                    <div className="space-y-1">
                                        <Label htmlFor="schedule">
                                            Horarios de Antención. Disponibilidad para que la Empresa recolecte los materiales reciclables{" "}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="schedule"
                                            name="schedule"
                                            value={formData.schedule}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Lunes a Viernes de 9 AM - 5 PM, Sábados 9 AM - 1 PM"
                                            disabled={isSubmitting}
                                            className={errors.schedule ? "border-red-500" : ""}
                                        />
                                        {errors.schedule && (
                                            <p className="text-sm text-red-500">{errors.schedule}</p>
                                        )}
                                    </div>

                                    {/* Imágenes */}
                                    <div className="space-y-1">
                                        <label className="mb-1 block text-sm font-medium">
                                            Evidencias <span className="text-red-500">*</span>{" "}
                                            <span className="text-xs text-muted-foreground">
                                                (al menos {MIN_FILES}, máximo {MAX_FILES})
                                            </span>
                                        </label>
                                        <div
                                            className={`border - 2 p - 4 ${errors.images ? "border-red-500" : "border-gray-300"} rounded - lg border - dashed`}
                                        >
                                            <div
                                                className="flex w-full cursor-pointer items-center justify-center bg-gray-50 py-3 transition-colors hover:bg-gray-100"
                                                onClick={() => imageInputRef.current?.click()}
                                            >
                                                <input
                                                    type="file"
                                                    id="images"
                                                    name="images"
                                                    ref={imageInputRef}
                                                    onChange={handleImageFilesChange}
                                                    className="hidden"
                                                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                                                    multiple
                                                    disabled={
                                                        isSubmitting || formData.images.length >= MAX_FILES
                                                    }
                                                />
                                                <Upload className="mr-2 h-5 w-5 text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    {formData.images.length >= MAX_FILES
                                                        ? `Máximo ${MAX_FILES} imágenes`
                                                        : `Añadir imágenes(${formData.images.length} / ${MAX_FILES})`}
                                                </span>
                                            </div>
                                            {imagePreviews.length > 0 && (
                                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                    {imagePreviews.map((previewUrl, index) => (
                                                        <div
                                                            key={index}
                                                            className="group relative aspect-square"
                                                        >
                                                            <Image
                                                                src={previewUrl}
                                                                alt={`Vista previa ${index + 1}`}
                                                                layout="fill"
                                                                objectFit="cover"
                                                                className="rounded"
                                                            />
                                                            <div className="relative truncate bg-white p-2 text-sm text-lime-600 font-semibold">
                                                                Tamaño: ({(formData.images[index].size / (1024 * 1024)).toFixed(2)} MB)
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute right-1 top-1 h-5 w-5 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                                                                onClick={() => removeImageFile(index)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.images && (
                                            <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col justify-center gap-3 sm:flex-row sm:items-start sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                        className="bg-gray-600 border-none hover:bg-gray-700 hover:text-white text-white cursor-pointer"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Publicar Material
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card >
                    )
            }
        </div >
    );
}
