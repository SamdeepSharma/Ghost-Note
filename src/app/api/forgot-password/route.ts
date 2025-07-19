import { sendResetPasswordEmail } from '@/helpers/sendResetPasswordEmail'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
     await dbConnect()

     const {email} = await request.json()
     
     // Check environment variables
     if (!process.env.GHOST_NOTE_EMAIL || !process.env.GHOST_NOTE_PASS) {
          console.error('Missing email environment variables:', {
               hasEmail: !!process.env.GHOST_NOTE_EMAIL,
               hasPassword: !!process.env.GHOST_NOTE_PASS
          })
          return Response.json(
               {
                    success: false,
                    message: "Email service not configured. Please contact administrator."
               }, { status: 500 }
          )
     }
     
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
          
          // Generate 6-digit OTP (ensuring it's always 6 digits)
          const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
          const expiryTime = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
          
          // Update user with OTP using the same pattern as verification
          user.verifyCode = otp
          user.verifyCodeExpiry = expiryTime
          await user.save()
          
          // Verify the OTP was saved by fetching again
          const verifyUser = await UserModel.findOne({ email }).lean()
          
          const emailResponse = await sendResetPasswordEmail(
               email,
               user.username,
               otp
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
                    message: "Reset Password OTP sent successfully."
               }, {status: 200}
          )
     } catch (error) {
          return Response.json(
               {
                    success: false,
                    message: 'Failed to send reset password email.'
               }, { status: 500 }
          )
     }
}