import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
     email: string,
     username: string,
     verifyCode: string
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
          subject: 'Ghost-Note | Verification Code',
          html: `
         <html lang="en" dir="ltr">
           <head>
             <title>Verification Code</title>
             <style>
               @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
               body {
                 font-family: 'Roboto', Verdana, sans-serif;
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
               <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
               <p><strong>${verifyCode}</strong></p>
               <p>If you did not request this code, please ignore this mail.</p>
               <a href="https://ghost-note.vercel.app/verify/${username}" class="button">Verify here</a>
             </div>
           </body>
         </html>
     `,
     };

     try {
          const res = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + res.response);
          return { success: true, message: "Verification email sent successfully." }

     } catch (emailError) {
          console.error("Error sending verification email", emailError)
          return { success: false, message: "Failed to send verification email." }
     }
}