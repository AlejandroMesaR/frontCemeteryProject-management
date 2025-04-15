import { useState, useEffect} from "react";
import { Input } from "../../components/utilsComponents/Input";
import Card  from "../../components/card/Card";
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell,} from "@/components/ui/table";
import EditUserDialog from "../../components/dialog/EditUserDialog";
import DeleteUserDialog from "../../components/dialog/DeleteUserDialog";
import RegsiterUser from "../../components/dialog/RegisterUserDialog";
import { getAllUsers } from "../../services/authService"; 
import { User } from "../../models/User"; 
import { capitalize } from "lodash";
import { useToast } from "../../components/toast/useToast";

const UserManagement = () => {

  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
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
        user.email.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, users]);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
          <p className="text-gray-500">Administrar usuarios y sus permisos de acceso</p>
        </div>
        <RegsiterUser 
          onComplete={(message,type) => {
            showToast(message,type);
            fetchUsers();
        }}/>
      </div>

      <Input
        placeholder="Buscar usuarios..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-sm rounded-full ${user.role === "ADMIN" ? "bg-black text-white" : "bg-gray-200"}`}>
                  {capitalize(user.role) || "Usuario"}
                </span>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-sm text-gray-500">
                  {user.identificationNumber}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
              <EditUserDialog
                user={user}
                onComplete={(message, type) => {
                  showToast(message,type);
                  fetchUsers();
                }}
              />
                <DeleteUserDialog 
                  user={user} 
                  onComplete={(message,type) => {
                    showToast(message,type);
                    fetchUsers();
                }}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserManagement;