import mongoose,{Schema,Document} from "mongoose";
export interface Message extends Document
{
    content:string;
    createdAt:Date;
}
const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, required: true, default:Date.now()}
});

export interface User extends Document
{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    verified:boolean;
    isAcceptingMessage: boolean;
    messages:Message[];
}
const UserSchema: Schema<User> =new Schema({
    username: {type: String, required: [true,"username required"],unique:true},
    email: {type: String, required: [true,"email required"],unique:true},
    password: {type: String, required: true},
    verifyCode: {type: String, required: true},
    verifyCodeExpiry: {type: Date, required: true},
    verified: {type: Boolean, default: false},
    isAcceptingMessage: {type: Boolean, required: true, default: true},
    messages: [MessageSchema],
});
const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model('User',UserSchema);
export default UserModel;
