import mongoose from "mongoose";
type connectionObject = {
    isConnected?: number;
}
const connection:connectionObject = {};
async function dbconnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }
    try{
       const db = await mongoose.connect(process.env.MONGODB_URI || '',{});
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected");
    }
    catch(err){
        console.log("Connection failed",err);
        process.exit(1);
    }
}
export default dbconnect;