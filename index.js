import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

//Schemas

const userSchema = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().required().min(1),
    password: joi.required()
});

//

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

db = mongoClient.db("myWallet");
const usersCollection = db.collection("users");

app.post("/sign-up", async (req, res) => {

    const user = req.body;
    
    
    const { error } = userSchema.validate(user, {abortEarly: false});
    if (error){
        const errors = error.details.map((details) => details.message);
        console.log(errors);
        res.status(400).send(errors)
    }

    const hashPassword = bcrypt.hashSync(user.password, 10);

    try {
        const emailExistente = await usersCollection.findOne({email: user.email});
        if(emailExistente){
            console.log(emailExistente)
            res.status(422).send("Ja foi criada uma conta com esse email!")
        }

        await usersCollection.insertOne({...user, password: hashPassword});
        res.send("OK");
    } catch (error) {
        console.log(error);
        res.send("Error")
    }



})

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const userExistente = await usersCollection.findOne({email: email});
        if(!userExistente){
            res.sendStatus(404)
        }

        const passwordOk = bcrypt.compareSync(password, userExistente.password);
        if(!passwordOk){
            res.sendStatus(401)
        }

        res.send(`Olá ${userExistente.name}, seja bem vindo(a)!`)

    } catch (err) {
        console.log(err, "erro no try/catch /login ")
        res.sendStatus(500)
    }
});   


// ROTAS:

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));