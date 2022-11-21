export function verificaHeaders(req, res, next){
    const { authorization } = req.headers; //Bearer Token
    //const token = authorization?.replace("Bearer ", "");
    if(!authorization){
        console.log("headers inválido")
        res.sendStatus(401);
        return;
    }
    next();
}