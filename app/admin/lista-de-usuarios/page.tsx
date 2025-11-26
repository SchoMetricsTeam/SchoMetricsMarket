"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users, Filter, Loader2, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Asegúrate que es el Badge correcto
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { getInitials } from "@/hooks/getInitials";
import AdminDeleteUser from "../components/AdminDeleteUser";
import { AdminNavigation } from "@/app/components/admin/AdminNavigation";

// Definición de la interfaz para los datos de usuario en la tabla de scores
interface AllDataUser {
  id: string;
  name: string;
  identifier: string;
  userType: string;
  avatarUrl?: string | null; // This will be the signed URL
  totalRecyclableMaterial: number;
  totalPurchasesMade: number;
  totalMaterialsSold: number;
  memberSince: string; // ISO date string
}

interface ApiResponse {
  users: AllDataUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const USER_TYPE_MAP: { [key: string]: string } = {
  SELLER: "Vendedor",
  BUYER: "Comprador",
  ADMIN: "Administrador",
};

const ITEMS_PER_PAGE = 10;

export default function ScoresPage() {
  const [users, setUsers] = useState<AllDataUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchScores = useCallback(
    async (page = 1, search = searchTerm, type = userTypeFilter) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });
        if (search) params.append("search", search);
        if (type !== "all") params.append("userType", type);

        const response = await fetch(
          `/api/admin/users/all-users?${params.toString()}`,
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al obtener los usuarios");
        }
        const data: ApiResponse = await response.json();
        setUsers(data.users);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido.",
        );
        setUsers([]); // Limpiar usuarios en caso de error
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, userTypeFilter],
  ); // Dependencias actualizadas

  useEffect(() => {
    fetchScores(1); // Cargar la primera página al inicio o cuando cambian los filtros
  }, [fetchScores]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toUpperCase());
    // No llamar a fetchScores aquí directamente para evitar múltiples requests si el usuario escribe rápido.
    // Se podría implementar un debounce o llamar en el submit de un botón de búsqueda.
    // Por ahora, la búsqueda se activa al cambiar de página o filtro, o al llamar a fetchScores manualmente.
  };

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    setCurrentPage(1); // Resetear a la primera página en nueva búsqueda
    fetchScores(1, searchTerm, userTypeFilter);
  };

  const handleUserTypeChange = (value: string) => {
    setUserTypeFilter(value);
    setCurrentPage(1); // Resetear a la primera página
    fetchScores(1, searchTerm, value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchScores(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Máximo de botones de página a mostrar (ej. 1 ... 3 4 5 ... 10)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Mostrar primera página y elipsis si es necesario
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > halfPagesToShow + 2) {
        items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      // Calcular rango de páginas a mostrar alrededor de la actual
      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage <= halfPagesToShow + 1) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      }
      if (currentPage >= totalPages - halfPagesToShow) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      // Mostrar elipsis y última página si es necesario
      if (currentPage < totalPages - halfPagesToShow - 1) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <div className="bg-black min-h-screen">
      <AdminNavigation />
      <div className="p-4 md:p-8">
        <div className="my-10 flex flex-col gap-2 rounded-xl bg-transparentp-6 text-rose-700 shadow-lg lg:mt-0">
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between">
            <div className="my-3">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8" />
                <h1 className="text-3xl font-bold tracking-tight">
                  Lista Usuarios
                </h1>
              </div>
              <p className="text-purple-100">
                Aquí se muestra la lista de usuarios registrados en SchoMetrics, sus compras y sus ventas.
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-4 md:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Identificador de Sesión..."
                  value={searchTerm}
                  onChange={
                    handleSearchChange
                  }
                  className="pl-10"
                />
              </div>
              <Select value={userTypeFilter} onValueChange={handleUserTypeChange}>
                <SelectTrigger className="w-full py-2 text-base md:w-[220px] cursor-pointer border hover:border-rose-600">
                  <Filter className="mr-2 h-5 w-5" />
                  <SelectValue placeholder="Filtrar por Tipo de Usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer hover:bg-slate-200" value="all">Todos los Tipos</SelectItem>
                  <SelectItem className="cursor-pointer hover:bg-slate-200" value="SELLER">Vendedor</SelectItem>
                  <SelectItem className="cursor-pointer hover:bg-slate-200" value="BUYER">Comprador</SelectItem>
                  <SelectItem className="cursor-pointer hover:bg-slate-200" value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="bg-red-600 py-2 text-white hover:bg-red-700 cursor-pointer"
              >
                Buscar
              </Button>
            </form>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">
                <p>{error}</p>
                <Button
                  onClick={() => fetchScores(currentPage)}
                  variant="outline"
                  className="mt-4"
                >
                  Reintentar
                </Button>
              </div>
            ) : users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 text-center text-white font-bold uppercase">Avatar</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Nombre</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Identificador de Cuenta</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Tipo</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Materiales Reciclables Publicados</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Comprados</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Vendidos</TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">
                          Miembro Desde
                        </TableHead>
                        <TableHead className="text-center text-white font-bold uppercase">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-center">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={user.avatarUrl || ""}
                                alt={user.name}
                              />
                              <AvatarFallback className="bg-purple-100 font-semibold text-purple-700">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell
                            className={
                              user.userType === "SELLER"
                                ? "text-lime-500 font-bold text-lg text-center uppercase"
                                : user.userType === "BUYER"
                                  ? "text-emerald-700 font-bold text-lg text-center uppercase"
                                  : user.userType === "ADMIN"
                                    ? "text-red-600 font-bold text-lg text-center uppercase"
                                    : "text-gray-100 font-bold text-lg text-center uppercase"
                            }
                          >
                            {user.name}
                          </TableCell>
                          <TableCell
                            className={
                              user.userType === "SELLER"
                                ? "text-lime-500 font-bold text-lg text-center uppercase"
                                : user.userType === "BUYER"
                                  ? "text-emerald-700 font-bold text-lg text-center uppercase"
                                  : user.userType === "ADMIN"
                                    ? "text-red-600 font-bold text-lg text-center uppercase"
                                    : "text-gray-100 font-bold text-lg text-center uppercase"
                            }
                          >
                            {user.identifier}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                user.userType === "SELLER"
                                  ? "secondary"
                                  : user.userType === "BUYER"
                                    ? "outline"
                                    : user.userType === "ADMIN"
                                      ? "outline" // Example: use outline for community
                                      : "default"
                              }
                              className={
                                user.userType === "SELLER"
                                  ? "border-lime-500 bg-lime-300 text-lime-800"
                                  : user.userType === "BUYER"
                                    ? "border-emerald-300 bg-emerald-400 text-emerald-900"
                                    : user.userType === "ADMIN"
                                      ? "bg-red-700 text-white"
                                      : "border-gray-300 bg-gray-100 text-gray-700"
                              }
                            >
                              {USER_TYPE_MAP[user.userType] || user.userType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-orange-500">
                            {user.totalRecyclableMaterial}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-[#53c932]">
                            {user.totalPurchasesMade}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-emerald-600">
                            {user.totalMaterialsSold}
                          </TableCell>
                          <TableCell className="text-center font-bold text-yellow-400">
                            {format(new Date(user.memberSince), "dd MMM, yyyy", {
                              locale: es,
                            })}
                          </TableCell>
                          <TableCell className="flex flex-col gap-2 text-center">
                            <Link href={`/admin/lista-de-usuarios/${user.id}`}>
                              <Button
                                variant="default"
                                title={`Ver Información Completa de ${user.name} - ${user.identifier}`}
                                className="bg-slate-500 text-white hover:bg-slate-600 cursor-pointer"
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                Ver Usuario
                              </Button>
                            </Link>
                            <AdminDeleteUser userId={user?.id} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="py-10 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  No se encontraron usuarios.
                </p>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar los filtros o el término de búsqueda.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
