export function verificaBody(req, res, next){
    const user = req.body;
    if(!user){
        res.sendStatus(401);
        return;
    }
    next();
}