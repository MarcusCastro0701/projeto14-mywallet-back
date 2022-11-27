export function verificaHeaders(req, res, next){
    const { authorization } = req.headers; //Bearer Token
    
    if(!authorization){
        console.log("headers inválido")
        res.sendStatus(401);
        return;
    }
    next();
}