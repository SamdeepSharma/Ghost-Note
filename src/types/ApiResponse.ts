import { Message } from "@/models/User";

export interface ApiResponse{
     success: Boolean;
     message: String;
     isAcceptingMessages?: boolean;
     messages?: Array<Message>;
}