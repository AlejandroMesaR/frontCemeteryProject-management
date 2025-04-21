import {api} from '../api/axios';
import { RegisterUserDTO} from '../models/User';

export const registerUser = async (data: RegisterUserDTO) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/auth/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/auth/${id}`);
  return response.data;
};

export async function login(username: string, password: string) {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    try {
      const token = response.data.token;
      localStorage.setItem("token", token); // Guarda el token en localStorage
      console.log("Token:", token);
      return token;
    }
    catch (error) {
      console.error("Error al guardar los tokens:", error);
    }
  };

export function logout() {
  localStorage.removeItem("token");
  // Opcionalmente redirigir a la página principal
  window.location.href = "/";
};

export const getAllUsers = async () => {
  try {
    // Hacemos la petición al endpoint
    const response = await api.get('/auth/allUsers');
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }

};
