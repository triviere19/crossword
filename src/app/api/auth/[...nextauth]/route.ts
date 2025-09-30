import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                if(credentials?.username && credentials.password){
                    if(credentials.username === process.env.ADMIN_USERNAME && credentials.password === process.env.ADMIN_PASSWORD){
                        return { id: "1", name: "Admin" }
                    }
                }
                
                return null

            }
        }),
    ],
    callbacks: {
        session({ session, token, user }) {
            return session // The return type will match the one returned in `useSession()`
        },
    },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }