/*
 * User table query model
 */

exports.pwdValidationQuery = "SELECT id, password FROM users WHERE username = (?);";

exports.userExistsQuery = "SELECT id, username FROM users WHERE username = (?);";

exports.viewAllUsersQuery = "SELECT id, username FROM users;";

exports.createUserQuery = "INSERT INTO users (username, password) VALUES (?, ?);";

exports.updateUserPwdQuery = "UPDATE users SET password = ? WHERE id = ?;";

exports.deleteUserQuery = "DELETE FROM users WHERE id = ?;";
