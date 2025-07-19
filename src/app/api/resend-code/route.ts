import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
     await dbConnect()

     const {username} = await request.json()
     try {
          const user = await UserModel.findOne({ username })
          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found"
                    }, { status: 404 }
               )
          }
          const email = user.email
          const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
          const expiryDate = new Date()
          user.verifyCode = verifyCode
          expiryDate.setMinutes(expiryDate.getMinutes() + 15)
          user.save()
          const emailResponse = await sendVerificationEmail(
               email,
               username,
               verifyCode
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
                    message: "Verification code resent successfully"
               }, {status: 200}
          )
     } catch (error) {
          return Response.json(
               {
                    success: false,
                    message: 'Failed to resend verification code'
               }, { status: 500 }
          )
     }
}