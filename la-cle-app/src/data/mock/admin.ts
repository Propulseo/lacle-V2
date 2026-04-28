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
  email: "admin@institutlacle.fr",
  password: "demo2026",
  firstName: "Marien",
  lastName: "Jesson",
  role: "admin",
};
