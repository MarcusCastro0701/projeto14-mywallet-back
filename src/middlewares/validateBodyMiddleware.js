export function verificaBody(req, res, next){
    const user = req.body;
    if(!user){
        console.log("BODY NÃO CHEGOU /CADASTRO")
        res.sendStatus(401);
        return;
    }
    next();
}