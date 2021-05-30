module.exports = app => {

    app.post('/signup',app.api.user.save)
    app.post('/sigin',app.api.auth.sigin)
    app.post('/validateToken',app.api.auth.validateToken)

    app.get('/getUsers',app.api.user.getUsers)
    app.get('/getUserByEmail',app.api.user.getByEmail)
    app.get('/getUserById',app.api.user.getById)
    app.route('/users')
        .post(app.api.user.save)
        .put(app.api.user.save)
        .delete(app.api.user.remove)

    app.route('/categories')
        .post(app.api.categories.save)
        .put(app.api.categories.save)
        .get(app.api.categories.get)
        .delete(app.api.categories.remove)

    app.route('/categories/Tree')
        .get(app.api.categories.getTree)

    app.route('/articles')
        .post(app.api.article.save)
        .put(app.api.article.save)
        .delete(app.api.article.remove)

    app.route('/articles/getPaged')
        .get(app.api.article.getPaged)

    app.route('/articles/getById')
        .get(app.api.article.getById)


}