/*
 * Server routes
 */

const authController = require('./controllers/authController');
const usersController = require('./controllers/usersController');
const newsController = require('./controllers/newsController');

const routes = [
    // --- Users Routes ---
    // authentication
    {
        method: 'POST',
        url: '/api/users/authenticate',
        handler: usersController.authenticate
    },
    // create new user
    {
        method: 'POST',
        url: '/api/users/create',
        handler: usersController.create
    },
    // read all users
    {
        method: 'GET',
        url: '/api/users/view',
        preValidation: authController.authenticate,
        handler: usersController.viewAll
    },
    // update user
    {
        method: 'POST',
        url: '/api/users/update',
        preValidation: authController.authenticate,
        handler: usersController.update
    },
    // delete user
    {
        method: 'POST',
        url: '/api/users/delete',
        preValidation: authController.authenticate,
        handler: usersController.delete
    },
    // --- News Routes ---
    // create a new entry
    {
        method: 'POST',
        url: '/api/news/create',
        handler: newsController.create
    },
    // read all news
    {
        method: 'GET',
        url: '/api/news/view',
        preValidation: authController.authenticate,
        handler: newsController.viewAll
    },
    // update news entry
    {
        method: 'POST',
        url: '/api/news/update',
        preValidation: authController.authenticate,
        handler: newsController.update
    },
    // delete news
    {
        method: 'POST',
        url: '/api/news/delete',
        preValidation: authController.authenticate,
        handler: newsController.delete
    }
]

module.exports = routes;
