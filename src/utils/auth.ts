// src/utils/auth.ts
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  exp: number;
  role: string[];
};

export function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log("Decoded JWT:", decoded);
    console.log("Decoded JWT role:", decoded.role);
    // Verifica si existe roles y es un array
    if (decoded.role && Array.isArray(decoded.role)) {
      console.log("Entre aqui", decoded.role);
      // Extrae solo el nombre del rol de la referencia completa
      const roleString = decoded.role[0];
      const match = roleString.match(/ROLE_(\w+)/);
      return match ? match[0] : null;
    }
    
    // Comprueba si existe role como string
    if (decoded.role) {
      console.log("Entre aqui singular", decoded.role);
      return typeof decoded.role === 'string' ? decoded.role : null;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
