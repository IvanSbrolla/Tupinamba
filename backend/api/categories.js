module.exports = app => {
    const { isNumeric, isString, notIsEmptyOrNull, notExist } = app.api.validations

    const save = async (req, res) => {
        const category = { ...req.body }

        try {
            if (req.query.id) {
                isNumeric(req.query.id, 'O campo ID deve ser um numero')
                const verifyIfHaveIdRegistered = await app.db('categories')
                    .select('id')
                    .where({id : req.query.id})
                    .first()
                    .catch( err => res.status(400).end({ "data": {}, "err": err }))
                    notIsEmptyOrNull(verifyIfHaveIdRegistered,'Id de categoria nao encontrado para modificacao')
            }
            notIsEmptyOrNull(category.name, 'O campo NAME nao pode ser do tipo null ou vazio')
            isString(category.name, 'O campo NAME deve ser um texto')
        } catch (err) {
            return res.status(400).json({ "data": {}, "err": err })
        }

        if (req.query.id) {
            app.db('categories')
                .update(category)
                .where({ id: req.query.id })
                .then(res.status(200).send())
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else {
            app.db('categories')
                .insert(category)
                .then(res.status(200).send())
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
    }

    const remove = (req, res) => {
        try {
            notIsEmptyOrNull(req.query.id, 'O campo ID nao pode ser do tipo null ou vazio')
            isNumeric(req.query.id, 'O campo ID deve ser um numero')

            app.db('categories')
                .select('id')
                .where({ parentId: req.query.id })
                .then(category => notExist(category, 'Esta categoria esta vinculada a uma subcategoria'))
                .catch(err => res.status(400).end({ "data": {}, "err": err }))

            app.db('articles')
                .select('id')
                .where({ categoryId: req.query.id })
                .then(category => notExist(category, 'Esta categoria esta vinculada a um artigo'))
                .catch(err => res.status(400).end({ "data": {}, "err": err }))
        } catch (err) {
            return res.status(400).json({ "data": {}, "err": err })
        }

        app.db('categories')
            .where({ id: req.query.id })
            .del()
            .then(category => notIsEmptyOrNull(category, 'Não foi possivel remover a categoria'))
            .then(res.status(204).end())
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {

        if (req.query.id) {
            app.db('categories')
                .select()
                .where({ id: req.query.id })
                .then(category => res.status(200).json({ "data": withPath(category), "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
        else {
            app.db('categories')
                .select()
                .then(categories => res.status(200).send({ "data": withPath(categories), "err": false }))
                .catch(err => res.status(500).end({ "data": {}, "err": err }))
        }
    }

    const toTree = (categories, tree) => {
        if (!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }


    const getTree = (req, res) => {
        app.db('categories')
            .select()
            .then(categories => res.status(200).json(toTree(withPath(categories))))
            .catch(err => res.status(500).end({ "data": {}, "err": err }))
    }

    return { save, remove, get, getTree }
}