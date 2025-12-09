import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function MongoConnection() {
  mongoose
    .connect(process.env.MONGO_DB_CONNECT as string)
    .then(() => {
      console.log("Mongo Database connected!");
    })
    .catch((err) => {
      console.log("Falha ao conectar: ", err);
    });
}
