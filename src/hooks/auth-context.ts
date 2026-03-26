import { createContext } from 'react';

export interface AdminPermissions {
  dashboardView: boolean;
  crmView: boolean;
  projectsView: boolean;
  projectsEdit: boolean;
  workspacesView: boolean;
  workspacesEdit: boolean;
  companyView: boolean;
  companyEdit: boolean;
  financeView: boolean;
  postsEdit: boolean;
  serverView: boolean;
  teamManage: boolean;
}

export interface AdminAccess {
  canAccessAdmin: boolean;
  isOwner: boolean;
  ownerId: string | null;
  role: string;
  permissions: AdminPermissions;
  collaborationId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  adminAccess?: AdminAccess;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
