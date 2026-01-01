export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  active: boolean;
}
