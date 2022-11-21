import express from "express";
import cors from "cors";
import joi from "joi";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import sessionRouters from './routes/sessionRoutes.js'
import walletRouters from './routes/walletRoutes.js'
import userRouters from './routes/userRoutes.js'


//Configs app
const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionRouters);
app.use(walletRouters);
app.use(userRouters);
//

dayjs.extend(customParseFormat);
export const today = dayjs().locale('pt-br').format('M/D')


//Schemas
export const userSchema = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().required().min(1),
    password: joi.required()
});


export const valorSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required().min(1),
    bool: joi.required().valid(true, false)
})
//







// ROTAS:

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));