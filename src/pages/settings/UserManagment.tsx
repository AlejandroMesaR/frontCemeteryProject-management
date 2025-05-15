import { useState, useEffect } from "react";
import { User } from "../../models/User";
import { getAllUsers, deleteUser } from "../../services/authService";
import { FaTrash } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditUserDialog from "../../components/dialog/EditUserDialog";
import RegsiterUser from "../../components/dialog/RegisterUserDialog";
import { useToast } from "../../components/toast/useToast";
import { capitalize } from "lodash";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Skeleton } from '@/components/ui/skeleton';

const UserManagement = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("Error al cargar usuarios:", error);
      Swal.fire("Error", `No se pudo cargar la información de los usuarios: ${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        (user.identificationNumber && user.identificationNumber.toLowerCase().includes(lowerSearch))
      )
    );
  }, [search, users]);

  const handleUpdate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Actualización Exitosa' : 'Error en la Actualización',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
  };

  const handleDelete = async (id: number, username: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el usuario de manera permanente al usuario ${username}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded mr-2',
        cancelButton: 'bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire('Eliminado', `El usuario ${username} ha sido eliminado exitosamente.`, 'success');
        fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al eliminar.', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className='bg-gray-100 px-4 mt-5'>
        <Card className="w-full">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
            <p className="text-sm text-gray-600">
              Administre usuarios y sus credenciales de acceso.
            </p>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 w-1/2 relative">
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Buscar por nombre, email o cédula..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 pl-9"
                />
              </div>
              <RegsiterUser 
                onComplete={(message, type) => {
                  showToast(message, type);
                  fetchUsers();
                }}
              />
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Usuario</TableHead>
                    <TableHead className="w-1/5">Rol</TableHead>
                    <TableHead className="w-1/5">Cédula</TableHead>
                    <TableHead className="w-1/4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        {search.trim() !== "" 
                          ? `No se encontraron resultados para "${search}"`
                          : "No hay usuarios registrados"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "default" : "outline"} className={user.role === "ADMIN" ? "bg-blue-500" : "bg-gray-200"}>
                            {capitalize(user.role) || "Usuario"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {user.identificationNumber || "No registrada"}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <EditUserDialog
                            user={user}
                            onComplete={(message, type) => {
                              handleUpdate(message, type);
                              fetchUsers();
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(user.id, user.username)}>
                            <FaTrash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;