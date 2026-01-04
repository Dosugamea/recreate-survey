// Mock for next-auth
export class AuthError extends Error {
  type: string;
  constructor(message?: string, type?: string) {
    super(message);
    this.type = type || "";
  }
}

const NextAuth = () => ({
  auth: async () => null,
  signIn: async () => {},
  signOut: async () => {},
  handlers: { GET: () => {}, POST: () => {} },
});

export default NextAuth;
