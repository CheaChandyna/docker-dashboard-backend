export interface JwtPayload {
  userId: number;
  user: string;
  role: 'user' | 'admin';
}