import { userSchema } from "../index.js";
import { usersCollection } from "../database/db.js";
import bcrypt from "bcrypt";




export async function postSignup (req, res) {

    const user = req.body;
    

    const emailExistente = await usersCollection.findOne({email: user.email});
        if(emailExistente){
            res.status(500).send("Ja foi criada uma conta com esse email!");
            return;
        }

    const hashPassword = bcrypt.hashSync(user.password, 10);

    const bodyCadastro = {
        name: user.name,
        email: user.email,
        password: hashPassword,
        content: []
    }

    try {
        await usersCollection.insertOne(bodyCadastro);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
        return;
    }



}