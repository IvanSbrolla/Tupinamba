module.exports = app => {
    const { isNumeric, isString, notIsEmptyOrNull, notExist, confirmPassword, isEmail, isStrongPassword } = app.api.validations
    const { encryptPassword } = app.api.crypt

    const save = async (req, res) => {
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
            if (!req.query.id) {
                const verifyIfHaveEmail = await getUserWithWhereEqual(res,'email',user.email)
                notExist(verifyIfHaveEmail, 'Email ja registrado')
            }
            else {
                const verifyIfHaveIdResgistered = await getUserWithWhereEqual(res, 'id', req.query.id)
                notIsEmptyOrNull(verifyIfHaveIdResgistered, `Usuario com o ID : ${req.query.id}, não encontrado!`)
            }
        }
        catch (err) {
            return res.status(400).json({ "data": {}, "err": err })
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (req.query.id) {
            const reqUser = updateUser(user, 'id', req.query.id)
            console.log(reqUser)
            res.status(200).send()
        }
        else {
            app.db('users')
                .insert(user)
                .then(res.status(200).send())
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
    }

    const getByEmail = async (req, res) => {
        let user = null
        try {
            notIsEmptyOrNull(req.query.email, 'Insira o EMAIL para buscar pelo usuario')
            isEmail(req.query.email, "Email inválido")
            user = await getUserWithWhereEqual(res, 'email', req.query.email)
            notIsEmptyOrNull(user, 'Usuario não encontrado')
            res.status(200).json({ "data": { user }, "err": false })
        } catch (err) {
            res.status(400).json({ "data": {}, "err": err })
        }
    }
    const getById = async (req, res) => {
        let user = null
        try {
            notIsEmptyOrNull(req.query.id, 'Insira o ID para buscar pelo usuario')
            isNumeric(req.query.id, "O campo ID deve ser um numero")
            user = await getUserWithWhereEqual(res, 'id', req.query.id)
            console.log(user)
            notIsEmptyOrNull(user, 'Usuario não encontrado')
            res.status(200).json({ "data": { user }, "err": false })
        } catch (err) {
            res.status(400).json({ "data": {}, "err": err })
        }
    }
    const getUsers = async (req, res) => {
        let user = null
        try {
            user = await getAllUsers(res, false)
            notIsEmptyOrNull(user[0], 'Nao foi possivel carregar a lista de usuarios')
            res.status(200).json({ "data": { user }, "err": false })
        } catch (err) {
            res.status(400).json({ "data": {}, "err": err })
        }
    }

    const remove = (req, res) => {
        try {
            notIsEmptyOrNull(req.query.id, "O campo ID nao pode ser do tipo null nem vazio")
            isNumeric(req.query.id, 'O campo ID deve ser um numero')
        } catch (err) {
            return res.status(400).end({ "data": {}, "err": err })
        }
        removeUser(res, { id: req.query.id })
    }

    function updateUser(user, whereKey, whereVal) {
        return app.db('users')
            .where(whereKey, whereVal)
            .update(user)
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    function getUserWithWhereEqual(res, whereKey, whereVal) {
        return app.db('users')
            .select('id', 'name', 'email', 'cargo', 'admin')
            .where(whereKey, whereVal)
            .first()
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    function getAllUsers(res) {
        return app.db('users')
            .select('id', 'name', 'email', 'cargo', 'admin')
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    function removeUser(res, objWhere) {
        app.db('users')
            .where(objWhere)
            .del()
            .then(user => notIsEmptyOrNull(user, 'Não foi possivel remover usuario'))
            .then(res.status(204).end())
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    return { save, getByEmail, getById, getUsers, remove }
}

