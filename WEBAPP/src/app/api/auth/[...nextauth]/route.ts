import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

const handler = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days (automatic expiration)
		updateAge: 24 * 60 * 60,    // 24 hours (refresh session if user is active)
	},
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 30 * 24 * 60 * 60, // 30 days
			}
		},
		callbackUrl: {
			name: `next-auth.callback-url`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			}
		},
		csrfToken: {
			name: `next-auth.csrf-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			}
		}
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				role: { label: "Role", type: "text" },
			},
			async authorize(credentials) {
				const client = await clientPromise;
				const db = client.db(process.env.DATABASE_NAME || "ai_therapist");
				const user = await db
					.collection("users")
					.findOne({ email: credentials?.email, role: credentials?.role });
				if (!user) return null;
				const isValid = await compare(credentials!.password, user.password);
				if (!isValid) return null;
				return {
					id: user._id.toString(),
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// Add user role to token on signin
			if (user) {
				const u = user as { role?: string };
				token.role = u.role;
			}
			
			// Check if token is expired (server-side validation)
			const now = Date.now() / 1000;
			const expTime = token.exp as number;
			if (expTime && now > expTime) {
				// Token is expired, but we can't return null in JWT callback
				// NextAuth will handle expiration automatically
				console.log('JWT token expired for user:', token.sub);
			}
			
			return token;
		},
		async session({ session, token }) {
			// Add role to session
			if (token && session.user) {
				(session.user as any).role = token.role;
			}
			return session;
		},
	},
	events: {
		async signOut(message) {
			// Log signout events for security monitoring
			console.log('User signed out at:', new Date().toISOString());
			if (message.session) {
				console.log('Session ended for user:', message.session.user?.email);
			}
		},
		async session(message) {
			// Log session access for monitoring (only in development)
			if (process.env.NODE_ENV === 'development') {
				console.log('Session accessed:', message.session?.user?.email, 'at', new Date().toISOString());
			}
		},
		async signIn(message) {
			// Log successful sign-ins
			console.log('User signed in:', message.user.email, 'at', new Date().toISOString());
		}
	},
	pages: {
		signIn: "/auth/signin",
	},
});

export { handler as GET, handler as POST };
