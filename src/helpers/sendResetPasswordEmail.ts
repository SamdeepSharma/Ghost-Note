import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";

export async function sendResetPasswordEmail(
     email: string,
     username: string,
     otp: string
): Promise<ApiResponse> {

     const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
               user: process.env.GHOST_NOTE_EMAIL,
               pass: process.env.GHOST_NOTE_PASS,
          },
     });

     const mailOptions = {
          from: process.env.GHOST_NOTE_EMAIL,
          to: email,
          subject: 'Ghost-Note | Password Reset OTP',
          html: `
         <html lang="en" dir="ltr">
           <head>
             <title>Password Reset OTP</title>
             <style>
               @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
               body {
                 font-family: 'Roboto', Verdana, sans-serif;
               }
               .otp {
                 font-size: 24px;
                 font-weight: bold;
                 color: #007bff;
                 padding: 10px;
                 background-color: #f8f9fa;
                 border-radius: 5px;
                 text-align: center;
                 margin: 20px 0;
               }
               .button {
                 color: #FFFFFF;
                 text-decoration: none;
                 padding: 10px 20px;
                 background-color: #007bff;
                 border: none;
                 border-radius: 5px;
                 display: inline-block;
                 margin-top: 20px;
               }
             </style>
           </head>
           <body>
             <div>
               <h2>Hello ${username},</h2>
               <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
               <div class="otp">${otp}</div>
               <p>This OTP will expire in 10 minutes.</p>
               <p>If you didn't request this password reset, please ignore this email.</p>
               <hr/>
               <p>Do not share this OTP with anyone else, it's highly confidential.</p>
               <p>Thanks for using our services</p>
               <p>Regards,</p>
               <p><b>Ghost Note</b></p>
             </div>
           </body>
         </html>
     `,
     };

     try {
          console.log('Email configuration:', {
               service: 'gmail',
               user: process.env.GHOST_NOTE_EMAIL,
               hasPassword: !!process.env.GHOST_NOTE_PASS
          })
          
          const res = await transporter.sendMail(mailOptions);
          console.log('Email sent successfully: ' + res.response);
          return { success: true, message: "Reset Password OTP sent successfully." }

     } catch (emailError: any) {
          console.error("Error sending reset password email:", emailError)
          console.error("Error details:", {
               code: emailError.code,
               command: emailError.command,
               response: emailError.response,
               responseCode: emailError.responseCode
          })
          
          let errorMessage = "Failed to send reset password email."
          
          if (emailError.code === 'EAUTH') {
               errorMessage = "Email authentication failed. Please check email credentials."
          } else if (emailError.code === 'ECONNECTION') {
               errorMessage = "Email connection failed. Please check internet connection."
          } else if (emailError.responseCode === 535) {
               errorMessage = "Email authentication failed. Please check app password."
          }
          
          return { success: false, message: errorMessage }
     }
}