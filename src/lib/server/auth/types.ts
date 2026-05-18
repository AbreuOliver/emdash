export type AdminRole = 'owner' | 'admin' | 'editor';

export type SessionUser = {
  id: string;
  email: string;
  role: AdminRole;
};

export type AuthSession = {
  token: string;
  user: SessionUser;
  expiresAt: number;
};
