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
          
          console.log('Generated OTP:', { otp, expiryTime })
          
          // Update user with OTP using the same pattern as verification
          user.verifyCode = otp
          user.verifyCodeExpiry = expiryTime
          await user.save()
          
          console.log('User updated with OTP:', {
               email: user.email,
               verifyCode: user.verifyCode,
               verifyCodeExpiry: user.verifyCodeExpiry
          })
          
          // Verify the OTP was saved by fetching again
          const verifyUser = await UserModel.findOne({ email }).lean()
          console.log('Verification - User after update:', {
               email: verifyUser?.email,
               verifyCode: verifyUser?.verifyCode,
               verifyCodeExpiry: verifyUser?.verifyCodeExpiry
          })
          
          console.log('Attempting to send email to:', email)
          console.log('Email credentials check:', {
               hasEmail: !!process.env.GHOST_NOTE_EMAIL,
               hasPassword: !!process.env.GHOST_NOTE_PASS,
               emailLength: process.env.GHOST_NOTE_EMAIL?.length
          })
          
          const emailResponse = await sendResetPasswordEmail(
               email,
               user.username,
               otp
          )
          
          console.log('Email response:', emailResponse)
          
          if(!emailResponse.success){
               console.error('Email sending failed:', emailResponse.message)
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
          console.log(error)
          return Response.json(
               {
                    success: false,
                    message: 'Failed to send reset password email.'
               }, { status: 500 }
          )
     }
}