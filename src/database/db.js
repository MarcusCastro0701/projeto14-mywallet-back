import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

//Data base e collections
db = mongoClient.db("myWallet");
export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
//