import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
     await dbConnect()

     const { username, content } = await request.json()
     try {
          const foundUser = await UserModel.findOne({ username })
          if (!foundUser) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found."
                    }, { status: 404 }
               )
          }

          if (!foundUser.isAcceptingMessages) {
               return Response.json(
                    {
                         success: false,
                         message: "User is not accepting messages."
                    }, { status: 403 }
               )
          }

          const newMessage = { content, createdAt: new Date() }
          foundUser.messages.push(newMessage as Message)
          await foundUser.save()

          return Response.json(
               {
                    success: true,
                    message: "Message sent successfully."
               }, { status: 200 }
          )

     } catch (error) {
          console.log("Error sending message.", error)
          return Response.json(
               {
                    success: false,
                    message: "Error sending message."
               }, { status: 500 }
          )
     }
}