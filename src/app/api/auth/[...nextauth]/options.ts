import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
     providers: [
          CredentialsProvider({
               id: "credentials",
               name: "Credentials",
               credentials: {
                    email: { label: "Email", type: "email", placeholder: "example123@example.com" },
                    password: { label: "Password", type: "password", placeholder: "••••••••" }
               },
               async authorize(credentials: any): Promise<any> {
                    await dbConnect()
                    try {
                         const user = await UserModel.findOne({
                              $or: [
                                   { email: credentials.identifier },
                                   { username: credentials.identifier }
                              ]
                         })
                         if (!user) {
                              throw new Error('No user found with this email.')
                         }
                         if (!user.isVerified) {
                              throw new Error('Please verify your account first before login.')
                         }
                         const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                         if (isPasswordCorrect) {
                              return user
                         }
                         else {
                              throw new Error('Invalid credentials.')
                         }
                    } catch (err: any) {
                         throw new Error(err)
                    }
               }
          })
     ],
     callbacks: {
          async jwt({ token, user }) {
               if (user) {
                    token._id = user._id?.toString()
                    token.isVerified = user.isVerified
                    token.isAcceptingMessages = user.isAcceptingMessages
                    token.username = user.username?.toString()
               }
               return token
          },
          async session({ session, token }) {
               if (token) {
                    session.user._id = token._id
                    session.user.isVerified = token.isVerified
                    session.user.isAcceptingMessages = token.isAcceptingMessages
                    session.user.username = token.username
               }
               return session
          }
     },
     pages: {
          signIn: '/sign-in'
     },
     session: {
          strategy: 'jwt'
     },
     secret: process.env.NEXTAUTH_SECRET
}