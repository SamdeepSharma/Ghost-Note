import { sendResetPasswordEmail } from '@/helpers/sendResetPasswordEmail'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
     await dbConnect()

     const {email} = await request.json()
     try {
          const user = await UserModel.findOne({ email })
          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found"
                    }, { status: 404 }
               )
          }
          const username = user.username
          const password = Math.floor(100000000 + Math.random() * 900000000).toString()
          const hashedPassword = await bcrypt.hash(password, 10)
          user.password = hashedPassword
          user.save()
          const emailResponse = await sendResetPasswordEmail(
               email,
               username,
               password
          )
          if(!emailResponse.success){
               return Response.json(
                    {
                         success: false,
                         message: emailResponse.message
                    },
                    {
                         status: 500
                    }
               )
          }
          return Response.json(
               {
                    success: true,
                    message: "Reset Password email sent successfully."
               }, {status: 200}
          )
     } catch (error) {
          console.log(error)
          return Response.json(
               {
                    success: false,
                    message: 'Failed to send reset password email.'
               }, { status: 500 }
          )
     }
}