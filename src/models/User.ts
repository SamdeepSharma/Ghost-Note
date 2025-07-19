import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
     content: string;
     createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
     content: {
          required: true,
          type: String
     },
     createdAt: {
          required: true,
          type: Date,
          default: Date.now
     }
})

export interface User extends Document {
     username: string;
     email: string;
     password: string;
     verifyCode: string;
     verifyCodeExpiry: Date;
     isVerified: boolean;
     isAcceptingMessages: boolean;
     messages: Message[];
     lastLogin?: Date;
     otpCode?: string;
     otpExpiry?: Date;
     createdAt: Date
}

const UserSchema: Schema<User> = new Schema({
     username: {
          required: [true, "Username is required"],
          lowercase: true,
          type: String,
          trim: true,
          unique: true
     },
     email: {
          required: [true, 'Email is required'],
          type: String,
          unique: true,
          match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'please use a valid email address']
     },
     password: {
          required: [true, 'password is required'],
          type: String
     },
     verifyCode: {
          required: [true, 'verify code is required'],
          type: String
     },
     verifyCodeExpiry: {
          required: [true, 'verify code expiry is required'],
          type: Date
     },
     isVerified: {
          type: Boolean,
          default: false
     },
     isAcceptingMessages: {
          type: Boolean,
          default: true
     },
     messages: [MessageSchema],
     lastLogin: {
          type: Date,
          default: null
     },
     otpCode: {
          type: String,
          default: null
     },
     otpExpiry: {
          type: Date,
          default: null
     },
     createdAt: {
          required: true,
          type: Date,
          default: Date.now
     },
}, {
     strict: false // Allow fields not in schema
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema)

export default UserModel;