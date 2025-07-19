import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: Request) {
     await dbConnect()

     const { searchParams } = new URL(request.url)
     const queryParams = {
          username: searchParams.get('username')
     }
     try {
          const user = await UserModel.findOne({ username: queryParams.username })
          if (!user) {
               return Response.json(
                    {
                         success: false,
                         message: "User not found"
                    }, { status: 404 }
               )
          }
          if (user.isVerified) {
               return Response.json(
                    {
                         success: true,
                         message: "User already verified"
                    }, { status: 200 }
               )
          }
          return Response.json(
               {
                    success: true,
                    message: "User not verified"
               }, { status: 200 }
          )

     } catch (error) {
          return Response.json(
               {
                    suceess: false,
                    message: "Unable to fetch user"
               }, { status: 500 }
          )
     }
}