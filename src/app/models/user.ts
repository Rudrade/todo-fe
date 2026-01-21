export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  active: boolean | undefined;
  mailSent: boolean | undefined;
  dtCreated: Date | undefined;
  isRequest: boolean;
  imageUrl: string | undefined;
  language: Language;
}

export const LANGUAGES = ['EN', 'PT'];
export type Language = (typeof LANGUAGES)[number];

export const ROLE = ['ROLE_USER', 'ROLE_ADMIN'];
export type Role = (typeof ROLE)[number];
