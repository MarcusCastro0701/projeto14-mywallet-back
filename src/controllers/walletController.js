import { valorSchema, today } from "../index.js";
import { usersCollection, sessionsCollection } from "../database/db.js";
import { ObjectId } from "mongodb";


export async function postWallet(req, res) {

    let arrValores = [];

    const valor = req.body;

    const newContent = {
        value: req.body.value,
        description: req.body.description,
        bool: req.body.bool,
        data: today
    }
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const { error } = valorSchema.validate(valor, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "valorSchema inválido");
        res.status(400).send(errors);
        return;
    }

    const session = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: session.userId });

    if (!session) {
        res.sendStatus(401);
        return;
    }

    const id = user._id;

    try {

        if (user.content.length === 0) {

            const setUserCadastro1 = {
                name: user.name,
                email: user.email,
                password: user.password,
                content: [newContent]
            }
            await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: setUserCadastro1 })

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
        await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: setUserCadastro2 })

        res.send(200);
        return;


    } catch (error) {
        console.log(error);
        res.sendStatus(401);
        return;
    }



}

export async function getWallet (req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

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