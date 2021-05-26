module.exports = app => {
    const { isNumeric, isString, notIsEmptyOrNull, notExist, confirmPassword, isEmail, isStrongPassword } = app.api.validations
    const { encryptPassword } = app.api.crypt

    const save = (req, res) => {
        const user = { ...req.body }
        try {
            notIsEmptyOrNull(user.name, 'Campo NAME é obrigatorio!')
            notIsEmptyOrNull(user.email, 'Campo EMAIL é obrigatorio!')
            notIsEmptyOrNull(user.password, 'Campo PASSWORD é obrigatorio!')
            notIsEmptyOrNull(user.confirmPassword, 'Campo CONFIRMPASSWORD é obrigatorio!')
            notIsEmptyOrNull(user.cargo, 'Campo CARGO é obrigatorio!')
            isEmail(user.email, 'Email invalido')
            isString(user.name, 'O campo NAME deve ser uma string')
            isString(user.cargo, 'O campo CARGO deve ser uma string')
            confirmPassword(user, 'As senhas não são iguais')
            isStrongPassword(user.password, 'A senha deve conter 1 letra maiuscula, 1 minuscula, 1 simbolo, 1 numero e no minimo 8 caracteres')
            if (!user.id) {
                app.db('users')
                    .select('email')
                    .where({ email: user.email })
                    .first()
                    .then(user => notExist(user, 'Email ja cadastrado'))
                    .catch(err => res.status(400).end({ "data": {}, "err": err }))

            }
        }
        catch (err) {
            return res.status(400).json({ "data": {}, "err": err })
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (req.query.id) {
            app.db('users')
                .update(user)
                .where({ id: req.query.id })
                .then(x => res.status(200).json({ "data": { user }, "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else {
            app.db('users')
                .insert(user)
                .then(x => res.status(200).json({ "data": { user }, "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }

    }

    const getUser = (req, res) => {
        if (req.query.email) {
            try {
                isEmail(req.query.email, "Email inválido")
            } catch (err) {
                res.status(400).json({ "data": {}, "err": err })
            }
            app.db('users')
                .select('id', 'name', 'email', 'cargo', 'admin')
                .where({ email: req.query.email })
                .then(users => res.status(200).json({ "data": { users }, "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else if (req.query.id) {
            try {
                isNumeric(req.query.id, "O campo ID deve ser um numero")
            } catch (err) {
                res.status(400).json({ "data": {}, "err": err })
            }
            app.db('users')
                .select('id', 'name', 'email', 'cargo', 'admin')
                .where({ id: req.query.id })
                .then(users => res.status(200).json({ "data": { users }, "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else {
            app.db('users')
                .select('id', 'name', 'email', 'cargo', 'admin')
                .then(users => res.status(200).json({ "data": { users }, "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
    }

    const remove = (req, res) => {
        try {
            notIsEmptyOrNull(req.query.id, "O campo ID nao pode ser do tipo null nem vazio")
            isNumeric(req.query.id, 'O campo ID deve ser um numero')
        } catch (err) {
            return res.status(400).end({ "data": {}, "err": err })
        }
        app.db('users')
            .where({ id: req.query.id })
            .del()
            .then(user => notIsEmptyOrNull(user, 'Não foi possivel remover usuario'))
            .then(res.status(204).end())
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }

    return { save, getUser }
}
