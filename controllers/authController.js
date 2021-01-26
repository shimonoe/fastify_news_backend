/*
 * Authenticate requests on route level
 */
'use strict';

exports.authenticate = async(req, reply) => {
    try {
        await req.jwtVerify();
    } catch (err) {
        reply.code(401).send({error: "Token de autorização inválido"});
    }
};
