module.exports = app => {

    app.route('/save')
        .post(app.api.user.save)
        .put(app.api.user.save)

    app.route('/getUser')
        .get(app.api.user.getUser)
}