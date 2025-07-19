import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
     await dbConnect()

     const { username, content } = await request.json()
     const newUsername = username.toLowerCase()
     try {
          const foundUser = await UserModel.findOne({ username: newUsername })
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
          return Response.json(
               {
                    success: false,
                    message: "Error sending message."
               }, { status: 500 }
          )
     }
}

export async function GET(request: Request) {
     await dbConnect()

     try {
          const {searchParams} = new URL(request.url)
          const queryParam = {
               username: searchParams.get('username')
          }
          if(!queryParam.username){
               return Response.json(
                    {
                         success: false,
                         message: "Invalid username"
                    },
                    {
                         status: 400
                    }
               )
          }

          const username = queryParam.username
          const newUsername = username.toLowerCase()
          const user = await UserModel.findOne({ username: newUsername })
          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found"
                    }, { status: 404 }
               )
          }

          const status = user.isAcceptingMessages
          if (status) {
               return Response.json(
                    {
                         success: true,
                         message: 'User is accepting messages'
                    }, { status: 200 }
               )
          }
          else {
               return Response.json(
                    {
                         success: true,
                         message: 'User is not accepting messages'
                    }, { status: 200 }
               )
          }

     } catch (error) {
          return Response.json(
               {
                    status: false,
                    message: "Error fetching status"
               }, { status: 500 }
          )
     }
}