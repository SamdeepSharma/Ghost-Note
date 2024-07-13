import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
     await dbConnect()

     const session = await getServerSession(authOptions)
     const user: User = session?.user as User
     if (!session || !session.user) {
          return Response.json(
               {
                    success: false,
                    message: "Not authenticated!"
               }, { status: 401 }
          )
     }
     const userId = new mongoose.Types.ObjectId(user._id)

     try {
          const foundUser = await UserModel.aggregate([
               {$match: {_id: userId}},
               {$unwind: '$messages'},
               {$sort: {'messages.createdAt': -1}},
               {$group: {_id: '$_id', messages: {$push: '$messages'}}}
          ])

          if(!foundUser || foundUser.length === 0){
               return Response.json(
                    {
                         success: false,
                         message: "User not found."
                    }, { status: 404 }
               )
          }

          return Response.json(
               {
                    success: true,
                    message: foundUser[0].messages
               }, { status: 200 }
          )

     } catch (error) {
          console.log("Error fetching messages.", error)
          return Response.json(
               {
                    success: false,
                    message: "Error fetching messages."
               }, { status: 500 }
          )
     }

}