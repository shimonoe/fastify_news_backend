/*
 * JWT configuration file
 */

const fs = require('fs');
const path = require('path');


const jwtConfig = {
    secret: {
        private: fs.readFileSync(path.join(__dirname, '.', 'certs', 'jwt.pem'), 'utf8'),
        public: fs.readFileSync(path.join(__dirname, '.', 'certs', 'jwt.pub'), 'utf8')
    },
    sign: {
        algorithm: 'RS256',
        expiresIn: "1h"
    },
    verify: { maxAge: "1h" }
}

module.exports = jwtConfig;
