export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  active: boolean | undefined;
  mailSent: boolean | undefined;
  dtCreated: Date | undefined;
  isRequest: boolean;
}
