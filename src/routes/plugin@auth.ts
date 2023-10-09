import { serverAuth$ } from "@builder.io/qwik-auth";
import GitHub from "@auth/core/providers/github";
import type { Provider } from "@auth/core/providers";
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import CredentialsProvider from "@auth/core/providers/credentials"
import Facebook from "@auth/core/providers/facebook"

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    providers: [Facebook({ clientId: env.get("FACEBOOK_CLIENT_ID"), clientSecret: env.get("FACEBOOK_CLIENT_SECRET") }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: {  label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          console.log(`login ${JSON.stringify(credentials)}`)
          const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            // console.log(`login ${JSON.stringify(cre)}`)
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }
      })
    ] as Provider[],
    adapter: FirestoreAdapter({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
      })
    })
  }));
