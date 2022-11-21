import { userSchema } from "../index.js";
import { usersCollection, sessionsCollection } from "../database/db.js";
import bcrypt from "bcrypt";


export async function postSignup (req, res) {

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