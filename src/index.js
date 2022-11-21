import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { v4 as uuidV4 } from 'uuid';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
dayjs.extend(customParseFormat);
const today = dayjs().locale('pt-br').format('M/D')


//Schemas
const userSchema = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().required().min(1),
    password: joi.required()
});


const valorSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required().min(1),
    bool: joi.required().valid(true, false)
})
//

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

//Data base e collections
db = mongoClient.db("myWallet");
const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");
//


app.post("/sign-up", postSignup);

app.post("/login", postLogin);  

app.post("/valor", postValor);

app.get("/wallet", getWallet);

app.delete("/sair", deleteSair);

async function postSignup (req, res) {

    const user = req.body;
    
    
    const { error } = userSchema.validate(user, {abortEarly: false});
    if (error){
        const errors = error.details.map((details) => details.message);
        console.log(errors);
        res.status(400).send(errors)
    }

    const hashPassword = bcrypt.hashSync(user.password, 10);

    const bodyCadastro = {
        name: user.name,
        email: user.email,
        password: hashPassword,
        content: []
    }

    try {
        const emailExistente = await usersCollection.findOne({email: user.email});
        if(emailExistente){
            res.status(500).send("Ja foi criada uma conta com esse email!");
            return;
        }

        await usersCollection.insertOne(bodyCadastro);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error);
        res.send("Error")
        return;
    }



}

async function postLogin (req, res) {

    const { email, password } = req.body;
    const token = uuidV4();
    
    
    try {
        const userExistente = await usersCollection.findOne({email: email});
        if(!userExistente){
            res.sendStatus(404);
            return;
        }

        const logado = await sessionsCollection.findOne({userId: userExistente._id});
        if(logado !== null){
            res.sendStatus(401);
            return;
        }

        const passwordOk = bcrypt.compareSync(password, userExistente.password);
        if(!passwordOk){
            res.sendStatus(401);
            return;
        }

        await db.collection("sessions").insertOne({
            token,
            userId: userExistente._id,
        })

        

        res.send([{ token: token, name: userExistente.name }])
        return;

    } catch (err) {
        console.log(err, "erro no try/catch /login ")
        res.sendStatus(500);
        return;
    }
}

async function postValor (req, res) {

    let arrValores = [];

    const valor = req.body;
    
    const newContent ={
        value: req.body.value,
        description: req.body.description,
        bool: req.body.bool,
        data: today
    }

    const { authorization } = req.headers; //Bearer Token
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        console.log("token inválido")
        res.sendStatus(401);
        return;
    }

    const { error } = valorSchema.validate(valor, {abortEarly: false});
    if (error){
        const errors = error.details.map((details) => details.message);
        console.log(errors, "valorSchema inválido");
        res.status(400).send(errors);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: session.userId });
        const id = user._id;
        if(user.content.length === 0){
            
            const setUserCadastro1 = {
                name: user.name,
                email: user.email,
                password: user.password,
                content: [newContent]
            }
            console.log(setUserCadastro1, "body que será colocado no lugar do antigo (na coleção de users)")
            await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: setUserCadastro1})
            console.log("Novo valor inserido na carteira")
            res.send(200);
            return;
        }

        arrValores = user.content;
        arrValores.push(newContent);
        const setUserCadastro2 = {
            name: user.name,
            email: user.email,
            password: user.password,
            content: arrValores
        }
        console.log(setUserCadastro2, "body que será colocado no lugar do antigo (na coleção de users)")
        await usersCollection.updateOne({_id: new ObjectId(id)}, {$set: setUserCadastro2})
        console.log("Novo valor inserido na carteira")
        res.send(200);
        return;
        


    } catch (error) {
        console.log(error);
        res.sendStatus(401);
        return;
    }



}

async function getWallet (req, res) {

    const { authorization } = req.headers; //Bearer Token

    const token = authorization?.replace("Bearer ", "");

    if(!token){
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: session.userId });
        res.send(user.content);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

    

}

async function deleteSair(req, res) {

    const { authorization } = req.headers; //Bearer Token

    const token = authorization?.replace("Bearer ", "");

    if(!token){
        res.sendStatus(401);
        return;
    }

    try{
        await sessionsCollection.deleteOne({token: token});
        res.sendStatus(200);
        return;
        
    }catch(error){

        console.log(error);
        res.send("HOUVE ERRO AO SAIR DA SESSÃO").status(500);
        return;
    }
}









// ROTAS:

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));