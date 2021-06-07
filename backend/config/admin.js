module.exports = middleware => {
    return (req, res, next) => {
        if (req.user.admin) {
            middleware(req, res, next)
            console.log(req.user)
        }
        else {
            res.status(401).send("É necessario ser admnistrador para realizar esta operação")
            console.log(req.user)
        }
    }
}