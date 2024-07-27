import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";

export async function sendResetPasswordEmail(
     email: string,
     username: string,
     password: string
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
          subject: 'Ghost-Note | Reset Password',
          html: `
         <html lang="en" dir="ltr">
           <head>
             <title>New Password</title>
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
               <p>Please use the following new password for signing in:</p>
               <p><b>${password}</b></p>
               <p>We advice you to change your password after logging in to your account.</p>
               <br/>
               <a href="https://ghost-note.vercel.app/sign-in" class="button">Sign In</a>
               <hr/>
               <p>Do not share this password with anyone else, its highly confidential.</p>
               <p>Thanks for using our services</p>
               <p>Regards,</p>
               <p><b>Ghost Note</b></p>
             </div>
           </body>
         </html>
     `,
     };

     try {
          const res = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + res.response);
          return { success: true, message: "Reset Password email sent successfully." }

     } catch (emailError) {
          console.error("Error sending verification email", emailError)
          return { success: false, message: "Failed to send reset password email." }
     }
}