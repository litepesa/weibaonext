import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        if (credentials.username === process.env.ADMIN_USERNAME) {
          const isValid = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH!
          );
          
          if (isValid) {
            return {
              id: '1',
              name: 'Admin',
              email: 'admin@weibao.com'
            };
          }
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt'
  }
});

export { handler as GET, handler as POST };