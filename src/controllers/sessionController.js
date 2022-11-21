import { usersCollection, sessionsCollection } from "../database/db.js";
import { v4 as uuidV4 } from 'uuid';
import bcrypt from "bcrypt";


export async function postLogin(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();

    const userExistente = await usersCollection.findOne({ email: email });
    if (!userExistente) {
        res.sendStatus(404);
        return;
    }

    const logado = await sessionsCollection.findOne({ userId: userExistente._id });
    if (logado !== null) {
        res.sendStatus(401);
        return;
    }

    const passwordOk = bcrypt.compareSync(password, userExistente.password);
    if (!passwordOk) {
        res.sendStatus(401);
        return;
    }

    try {

        await sessionsCollection.insertOne({
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

export async function deleteSair (req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");


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