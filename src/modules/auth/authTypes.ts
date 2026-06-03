export type AuthContext = {
  userId: string;
  email: string | null;
  claims: Record<string, unknown>;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
