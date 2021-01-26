/*
 * News API routes controllers
 */
'use strict';

const passwordHash = require('password-hash');
const db = require('../database/connect');
const newsSchema = require('../database/models/newsSchema');


// Create a new entry
exports.create = async (req, reply) => {
    try {
        let params = req.body;
        if (
            params == null ||
            !params.source_id ||
            !params.source_name ||
            !params.title ||
            !params.description ||
            !params.url ||
            !params.content
        ) {throw Error('Os parâmetros "source_id", "source_name", "title", "description", "url" e "content" são obrigatórios');}

        const data = {...newsSchema.baseSchema, ...params};

        let columns = Object.keys(data)
            .filter((key) => { if (data[key] != null) return key})
            .join(', ');
        let values = Object.values(data)
            .filter((value) => {
                if (value != null && typeof value === 'numeric') return value;
                if (value != null) return String(value);
            })
            .join(', ');

        let query = newsSchema.createQuery.replace("{columns}", columns).replace("{values}", values);
        
        await db.run(query, (err) =>{
            if (err) reply.code(500).send(err);
            else reply.code(200).send({"sucess": "Novo registro de notícia criado com sucesso"});
        });

    } catch (error) {
        reply.code(400).send(error);
    }
};

// Read all news
exports.viewAll = async (req, reply) => {
    try {
        await db.all(newsSchema.viewAllQuery, (error, rows) => {
            if (error) reply.code(500).send(error);
            if (rows == null) reply.code(204).send({"message": 'Nenhuma notícia encontrada'});
            else reply.code(200).send({"data": rows});
        })
    } catch (error) {
        reply.code(400).send(error);
    }
}

// Update news entry
exports.update = async (req, reply) => {
    try {
        let params = req.body;
        if (!params || !params.id) throw Error('O campo "id" é obrigatório');

        await db.get(newsSchema.newsWithId, [params.id], (err, row) => {
            if (err) reply.code(500).send(error);
            if (row == null) {
                reply.code(400).send({"message": "Nenhuma notícia encontrada com o id"});
            } else {
                const data = {...newsSchema.baseSchema, ...params};

                var updates = [];
                for (var key in data) {
                    if (key != 'id' && data[key] != null) {
                        updates.push(`${key} = ${data[key]}`);
                    }
                }

                let query = newsSchema.updateQuery.replace("{updates}", updates.join(', '));
                db.run(query, [params.id], (err) => {
                    if (err) reply.code(400).send(err);
                    else reply.code(200).send({"success": `Notícia de id ${params.id} atualizada`});
                })
            }
        });
    } catch (error) {
        reply.code(400).send(error);
    }
}

// Delete news entry
exports.delete = async (req, reply) => {
    try {
        let params = req.body;
        if (!params || !params.id) throw Error('O campo "id" é obrigatório');


        await db.get(newsSchema.newsWithId, [params.id], (err, row) => {
            if (err) reply.code(500).send(error);
            if (row == null) {
                reply.code(400).send({"message": "Nenhuma notícia encontrada com o id"});
            } else {
                db.run(newsSchema.deleteNewsQuery, [params.id], (err) => {
                    if (err) reply.code(500).send(error);
                    else reply.code(200).send({"success": `Notícia de id ${params.id} deletada`});
                });
            }
        });
    } catch (error) {
        reply.code(400).send(error);
    }
}
