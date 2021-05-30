const jwt = require('jwt-simple')
const { authSecret } = require('../.env')
const bcrypt = require('bcrypt');

module.exports = app => {
    const sigin = async (req, res) => {
        const infosUser = { ...req.body }
        if (!infosUser.email || !infosUser.password) {
            return res.status(400).send(`Informe usuario e senha!`)
        }

        const user = await app.db('users')
            .select()
            .where({ email: infosUser.email })
            .first()
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    
        if (!user) res.status(400).send(`Email não cadastrado!`)

        const isMatch = bcrypt.compareSync(infosUser.password, user.password)
        if (!isMatch) return res.status(400).send(`Email/Senha inválidos!`)

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) return res.end(true)
            }
        } catch (err) {

        }
        res.end(false)
    }

    return { sigin, validateToken }
}