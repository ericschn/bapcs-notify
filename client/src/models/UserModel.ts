export interface User {
  email: string;
  phone?: number;
  notifications?: {
    email: boolean;
    phone: boolean;
  }
}