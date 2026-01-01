// Mock for next-auth
const NextAuth = () => ({
  auth: async () => null,
  signIn: async () => {},
  signOut: async () => {},
  handlers: { GET: () => {}, POST: () => {} },
});

export default NextAuth;
