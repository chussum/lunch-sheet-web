export interface User {
  id: number;
  role: string;
  googleId: string;
  email: string;
  name: string;
  profileImage: string;
  createdAt: Date | string | undefined;
  updatedAt: Date | string | undefined;
}

export interface UserInput {
  role?: string;
  googleId: string;
  email?: string;
  name?: string;
  profileImage?: string;
}
