import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
     await dbConnect()

     try {
          const { email, otp } = await request.json()
          console.log('OTP verification attempt:', { email, otp })
          
          const user = await UserModel.findOne({ email })

          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: 'User not found'
                    }, { status: 404 }
               )
          }
          
          console.log('User found:', {
               email: user.email,
               verifyCode: user.verifyCode,
               verifyCodeExpiry: user.verifyCodeExpiry
          })
          
          const isCodeValid = user.verifyCode === otp
          const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

          if (isCodeValid && isCodeNotExpired) {
               return Response.json(
                    {
                         success: true,
                         message: "OTP verified successfully."
                    }, { status: 200 }
               )
          }
          else if(!isCodeNotExpired){
               return Response.json(
                    {
                         success: false,
                         message: "OTP has expired. Please request a new one."
                    }, {status:400}
               )
          }
          else{
               return Response.json(
                    {
                         success: false,
                         message: "Invalid OTP."
                    }, {status:400}
               )
          }
          
          return Response.json(
               {
                    success: true,
                    message: "OTP verified successfully"
               }, {status: 200}
          )
     } catch (error) {
          console.log(error)
          return Response.json(
               {
                    success: false,
                    message: 'Failed to verify OTP.'
               }, { status: 500 }
          )
     }
} 