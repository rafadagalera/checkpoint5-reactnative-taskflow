export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export type Treatment = 'Sr.' | 'Sra.' | 'Srta.';
