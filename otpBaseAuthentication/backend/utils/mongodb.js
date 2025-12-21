import mongoose from "mongoose";

const connectDB = async() => {
    mongoose.connection.on('connected', ()=>{
        console.log('Db Connected');
    })

    await mongoose.connect(`${process.env.MONGO_URI}/otpBaseAuthentication`);
}

export default connectDB;