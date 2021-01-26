/*
 * News table query model
 */

exports.baseSchema = {
    source_id: null,
    source_name: null,
    category: null,
    author: null,
    title: null,
    description: null,
    url: null,
    content: null,
    published_at: null
}

exports.createQuery = "INSERT INTO news ({columns}) VALUES ({values});";

exports.viewAllQuery = "SELECT * FROM news;";

exports.updateQuery = "UPDATE news SET {updates} WHERE id = ?;";

exports.newsWithId = "SELECT id, source_id FROM news WHERE id = ?";

exports.deleteNewsQuery = "DELETE FROM news WHERE id = ?;";
