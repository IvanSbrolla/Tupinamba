module.exports = app => {
    const save = (req, res) => {
        const article = { ...req.body }
        const { isNumeric, isString, notIsEmptyOrNull, notExist } = app.api.validations
        try {
            notIsEmptyOrNull(article.name, 'O campo NAME nao pode ser do tipo null ou vazio')
            notIsEmptyOrNull(article.description, 'O campo DESCRIPTION nao pode ser do tipo null ou vazio')
            notIsEmptyOrNull(article.content, 'O campo CONTENT nao pode ser do tipo null ou vazio')
            notIsEmptyOrNull(article.userId, 'O campo USERID nao pode ser do tipo null ou vazio')
            notIsEmptyOrNull(article.categoryId, 'O campo CATEGORYID nao pode ser do tipo null ou vazio')

            isString(article.name, 'O campo NAME deve ser do tipo string')
            isString(article.description, 'O campo DESCRIPTION deve ser do tipo string')

            isNumeric(article.userId, 'O campo USERID deve ser um numero')
            isNumeric(article.categoryId, 'O campo CATEGORYID deve ser um numero')

            if (!req.query.id) {
                app.db('articles')
                    .select('description')
                    .where({ description: article.description })
                    .then(objArticle => notExist(objArticle, 'Ja esxiste um artigo com essa descrição'))
                    .catch(err => res.status(400).end({ "data": {}, "err": err }))

                app.db('articles')
                    .select('content')
                    .where({ content: article.content })
                    .then(objArticle => notExist(objArticle, 'Ja esxiste um artigo com esse conteudo'))
                    .catch(err => res.status(400).end({ "data": {}, "err": err }))
            }

        } catch (err) {
            res.status(400).json({ "data": {}, "err": err })
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(objArticle => res.status(200).json({ "data": { article }, 'err': false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else {
            app.db('articles')
                .insert(article)
                .then(objArticle => res.status(200).json({ "data": { article }, 'err': false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }

    }

    const remove = (req, res) => {
        try {
            notIsEmptyOrNull(req.query.id, 'O campo ID nao pode ser do tipo null ou vazio')
            isNumeric(req.query.id, 'O campo ID deve ser um numero')
        } catch (err) {
            res.status(400).json({ "data": {}, "err": err })
        }
        app.db('articles')
            .where({ id: req.query.id })
            .del()
            .then(objArticle => notIsEmptyOrNull(objArticle, 'Não foi possivel remover usuario'))
            .then(res.status(204).end())
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }

    const getPaged = async (req, res) => {
        const page = req.query.page || 1
        const limit = 10
        const count = await app.db('articles').count('id')

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.status(200).json({ "data": { articles, count, limit }, "err": false }))
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    const getById = (req, res) => {
        try {
            notIsEmptyOrNull(req.query.id, 'O campo ID nao pode ser do tipo null ou vazio')
            isNumeric(req.query.id, 'O campo ID deve ser um numero')
        } catch (error) {
            res.status(400).json({ "data": {}, "err": err })
        }
        app.db('articles')
            .select()
            .where({ id: req.query.id })
            .first()
            .then(article => res.status(200).json({ "data": { article }, "err": false }))
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }
    return { save, remove, getById, getPaged }
}