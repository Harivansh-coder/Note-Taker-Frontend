export interface User {
  name: string;
  email: string;
  dateOfBirth?: string;
}

export interface Note {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface AuthResponse {
  user?: User;
  token: string;
}
