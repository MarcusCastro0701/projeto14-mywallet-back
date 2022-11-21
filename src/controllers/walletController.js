import { valorSchema, today } from "../index.js";
import { usersCollection, sessionsCollection } from "../database/db.js";
import { ObjectId } from "mongodb";


export async function postWallet (req, res) {

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

export async function getWallet (req, res) {

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