import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
     email: string,
     username: string,
     verifyCode: string
): Promise<ApiResponse> {
     const newUsername = username.toLowerCase()
     try {
          await resend.emails.send({
               from: 'onboarding@resend.dev',
               to: email,
               subject: 'InsightSphere | Verification Code',
               react: VerificationEmail({ newUsername, otp: verifyCode })
          });        
          return { success: true, message: "Verification email sent successfully." }

          } catch (emailError) {
               console.error("Error sending verification email", emailError)
               return { success: false, message: "Failed to send verification email." }
          }
     }