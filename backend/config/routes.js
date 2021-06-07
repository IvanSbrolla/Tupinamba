const admin = require('./admin.js')

module.exports = app => {

    app.post('/signup', app.api.user.save)
    app.post('/sigin', app.api.auth.sigin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/getUsers')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getUsers)

    app.route('/getUserByEmail')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getByEmail)

    app.route('/getUserById')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getById)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .put(admin(app.api.user.save))
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.categories.save))
        .put(admin(app.api.categories.save))
        .get(app.api.categories.get)
        .delete(admin(app.api.categories.remove))

    app.route('/categories/Tree')
        .all(app.config.passport.authenticate())
        .get(app.api.categories.getTree)

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.article.save))
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    app.route('/articles/getPaged')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getPaged)

    app.route('/articles/getById')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)


}