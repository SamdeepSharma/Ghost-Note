import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
     await dbConnect()

     try {
          const { email, otp, newPassword } = await request.json()
          
          const user = await UserModel.findOne({ email })

          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found"
                    }, { status: 404 }
               )
          }
          
          const isCodeValid = user.verifyCode === otp
          const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

          if (isCodeValid && isCodeNotExpired) {
               // Hash the new password and update
               const hashedPassword = await bcrypt.hash(newPassword, 10)
               user.password = hashedPassword
               await user.save()
               
               return Response.json(
                    {
                         success: true,
                         message: "Password reset successfully"
                    }, { status: 200 }
               )
          }
          else if(!isCodeNotExpired){
               return Response.json(
                    {
                         success: false,
                         message: "OTP has expired. Please request a new one."
                    }, { status: 400 }
               )
          }
          else{
               return Response.json(
                    {
                         success: false,
                         message: "Invalid OTP."
                    }, { status: 400 }
               )
          }
     } catch (error) {
          console.log(error)
          return Response.json(
               {
                    success: false,
                    message: 'Failed to reset password.'
               }, { status: 500 }
          )
     }
} 