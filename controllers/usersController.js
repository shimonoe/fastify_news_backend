/*
 * Users API routes controllers
 */
'use strict';

const passwordHash = require('password-hash');
const db = require('../database/connect');
const userSchema = require('../database/models/userSchema');

// User validation
exports.authenticate = async (req, reply) => {
    try {
        const params = req.body;
        if (params == null || !params.username || !params.password)
            throw Error({error: "Informe o usuário e senha para prosseguir"});

        await db.get(userSchema.pwdValidationQuery, [params.username], (err, row) => {
            if (err || row == null || !passwordHash.verify(params.password, row.password)) {
                reply.code(401).send({error: "Usuário ou senha inválidos"});
            } else {
                reply.jwtSign({username: params.username, timestamp: new Date()})
                    .then((token) => {
                        reply.code(200).header('Authorization', `Bearer ${token}`).send();
                    });
            }
        });
    } catch (error) {
        reply.code(401).send(error);
    }
};

// Create user
exports.create = async (req, reply) => {
    try {
        const params = req.body;
        if (params == null || !params.username || !params.password)
            throw Error('Os parâmetros "username" e "password" são obrigatórios');

        await db.get(userSchema.userExistsQuery, (params.username), (err, row) => {
            if (err) throw Error(err);

            if (row != null) {
                reply.code(400).send({"error": "Usuário já cadastrado"});
            } else {
                let pwd = passwordHash.generate(params.password);
                db.run(userSchema.createUserQuery, [params.username, pwd], (err) => {
                    if (err) throw Error(err);
                    else reply.code(200).send({"success": "Usuário criado com sucesso!"});
                });
            }
        });
    } catch (error) {
        reply.code(400).send(error);
    }
};

// Read all
exports.viewAll = async (req, reply) => {
    try {
        await db.all(userSchema.viewAllUsersQuery, (err, rows) => {
            let data = {};
            if (err || rows == null) {
                reply.code(204).send({...data});
            } else {
                data = rows;
                reply.code(200).send({...data});
            }
        });
    } catch (error) {
        reply.code(400).send(error);
    }
};

// Update user
exports.update = async (req, reply) => {
    try {
        const params = req.body;
        if (params == null || !params.username || !params.old_password || !params.new_password)
            throw Error('Os parâmetros "username", "old_password" e "new_password" são obrigatórios');

        await db.get(userSchema.pwdValidationQuery, [params.username], (err, row) => {
            if (err || row == null || !passwordHash.verify(params.old_password, row.password)) {
                reply.code(401).send({error: "Usuário ou senha inválidos"});
            } else {
                let pwd = passwordHash.generate(params.new_password);
                db.run(userSchema.updateUserPwdQuery, [pwd, row.id], (err) => {
                    if (err) throw Error(err);
                    else reply.code(200).send({"success": "Senha atualizada com sucesso"});
                });
            }
        });
    } catch (error) {
        reply.code(400).send(error);
    }
}

// Delete user
exports.delete = async (req, reply) => {
    try {
        const params = req.body;
        if (params == null || !params.username || !params.password)
            throw Error({error: 'Os parâmetros "username" e "password" são obrigatórios'});

        await db.get(userSchema.pwdValidationQuery, [params.username], (err, row) => {
            if (err || row == null || !passwordHash.verify(params.password, row.password)) {
                reply.code(401).send({error: "Usuário ou senha inválidos"});
            } else {
                db.run(userSchema.deleteUserQuery, [row.id], (err) => {
                    if (err) throw Error(err);
                    else reply.code(200).send({"success": "Usuário deletado com sucesso"});
                });
            }
        });
        
    } catch (error) {
        reply.code(400).send(error);
    }
}
