export interface RegisterUserDTO {
  username: string;
  email: string;
  identificationNumber: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  identificationNumber: string;
  role?: string;
}

