export interface AdminUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin";
}

export const mockAdmin: AdminUser = {
  id: "admin-1",
  email: "admin@lacleformation.fr",
  password: "admin123",
  firstName: "Rebecca",
  lastName: "Chaillon",
  role: "admin",
};
