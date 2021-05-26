module.exports = app => {

    app.route('/user')
        .post(app.api.user.save)
        .put(app.api.user.save)
        .get(app.api.user.getUser)
        .delete(app.api.user.remove)

    app.route('/categories')
        .post(app.api.categories.save)
        .put(app.api.categories.save)
        .get(app.api.categories.get)
        .delete(app.api.categories.remove)
    
    app.route('/getCategoriesTree')
        .get(app.api.categories.getTree)

}