'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { reportSchema } from '@/lib/schemas';
import { MailWarning } from 'lucide-react';
import toast from 'react-hot-toast';
import useUserSession from '@/hooks/useUserSession';

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
    const session = useUserSession()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            title: '',
            sellerName: '',
            rfc: '',
            cct: '',
            content: '',
        },
    });

    const onSubmit = async (data: ReportFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Algo salió mal. Por favor, inténtalo de nuevo.');
            }
            toast.success("Reporte Enviado. Gracias por tu reporte. Lo hemos recibido correctamente.")
            router.push('/'); // Redirige a la página principal o a una de "gracias"
        } catch (error: any) {
            toast.error("Erorr al crear el reporte.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="container mx-auto max-w-2xl py-12">
                <div className="space-y-4 text-center bg-[#fdf8f8] rounded-l-md rounded-r-md rounded-t-md rounded-b-none p-5">
                    <MailWarning className="h-10 w-10 mx-auto text-rose-600 animate-heartbeat" />
                    <h1 className="text-3xl text-red-600 font-bold tracking-tighter sm:text-4xl">Buzón de Reportes</h1>
                    <p className="text-muted-foreground">
                        Envíanos tu reporte, queja o sugerencia. Tu voz es importante.
                    </p>
                    <p className="text-pink-700 text-start">
                        ¿Tuviste algún inconveniente al momento de <b className='text-orange-400'>Comprar, Vender, Recoger o Entregar</b>, <b className='text-green-500'>Material Reciclable</b>?
                        <br />
                        Puedes realizar un reporte completando el siguiente formulario. Asegúrate de llenar los campos solicitados de manera correcta para darle pronto seguimiento a tu reporte.
                    </p>
                    <p className='text-start text-pink-700'>Si lo prefieres, nos puedes contactar directamente vía correo electrónico: {" "}
                        <a href="mailto:soporte@schometrics.com" className='text-blue-500 border-b font-semibold'>soporte@schometrics.com</a>

                    </p>
                </div>
                <div className="bg-[#fdf8f8] p-5 relative rounded-t-none rounded-b-md">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título del Reporte</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej. Problema con mi compra, venta o recolección de material reciclable" {...field}
                                                disabled={isLoading}
                                                className='bg-white border-rose-300'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="targetType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirigido a</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className='bg-white border-rose-300 cursor-pointer'>
                                                        <SelectValue placeholder="Selecciona una opción" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectItem className='hover:bg-rose-100 cursor-pointer' value="Escuela">Escuela</SelectItem>
                                                    <SelectItem className='hover:bg-rose-100 cursor-pointer' value="Empresa">Empresa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reportUserType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Soy un</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className='bg-white border-rose-300 cursor-pointer'>
                                                        <SelectValue placeholder="Selecciona tu rol" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem className='hover:bg-rose-100 cursor-pointer' value="Comprador">Comprador</SelectItem>
                                                    <SelectItem className='hover:bg-rose-100 cursor-pointer' value="Vendedor">Vendedor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="sellerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de la Escuela o Empresa a la que va dirigido el reporte</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Universidad del Sol" {...field} disabled={isLoading} className='bg-white border-rose-300 uppercase' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="rfc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RFC del Vendedor o Comprador al que va dirigido el reporte</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Registro Federal del Contribuyente" {...field} disabled={isLoading} className='bg-white border-rose-300' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cct"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CCT (Solo si el reporte es dirigido a una Escuela, de lo contrario, dejar vacío)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Clave del Centro de Trabajo" {...field} disabled={isLoading} className='bg-white border-rose-300' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contenido del Reporte (Redacta de manera detallada el problema)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe detalladamente la situación aquí..."
                                                className='bg-white border-rose-300 resize-y'
                                                rows={8}
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white cursor-pointer" disabled={isLoading}>
                                <MailWarning className="mr-2 h-5 w-5" />
                                {isLoading ? 'Enviando...' : 'Enviar Reporte'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}