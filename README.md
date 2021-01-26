# fastify_news_backend
Fastify POC for news REST API and Token authentication

## System dependencies
*  Node.js == v14.15.4
*  Python >= 3.7
*  Make >= 4.2.1
*  OpenSSL >= 1.1.1f
*  curl >= 7.68.0

If you have a OS that sets Python environment as `python3`, add a python alias to `.bashrc` in your home folder:

`$ cd && "alias python=python3" >> .bashrc`

Then close and open your terminal again :)

## How to run a local server
This is a tutorial for test in your local environment

#### 1. Clone repository:
`$ git clone https://github.com/shimonoe/fastify_news_backend.git && cd fastify_news_backend`

#### 2. Install project packages
`$ npm i`

#### 3. Create local private keys and certs for HTTPS and JWT authentication
`$ mkdir certs`
##### Create x509 key and cert files
`$ openssl req -nodes -new -x509 -keyout ./certs/server.key -out ./certs/server.cert -subj "/C=BR/ST=SP/L=Sao-Paulo"`
##### Create a private and public keys for JWT
`$ openssl genrsa -out ./certs/jwt.pem 2048 && openssl rsa -in ./certs/jwt.pem -outform PEM -pubout -out ./certs/jwt.pub`

#### 4. Run project
`$ node run.js`

#### 5. Try some routes (open `routes.js` to see all)
##### This is a authentication method for dummy user `demo`
`$ curl -k -v --location --request POST 'https://0.0.0.0:8000/api/users/authenticate' --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'username=demo' --data-urlencode 'password=demo'`

## How to run in a Docker container

#### 1. Install latest docker-engine

#### 2. Make sure to clean npm cache
`$ npm cache clean --force`

#### 3. Build a project container
`$ docker build -f Dockerfile . -t "name:fastify_news_api"`

#### 4. Run container
`$ docker run -p 8000:8000 -t "name:fastify_news_api"`

## Future improvements
- [ ] Alpine Linux container image hardening
- [ ] Make Fastify parse URI parameters
- [ ] Migrate a in memory sqlite3 database to a real service
- [ ] Create Integration tests with Fastify Tests API
- [ ] Create Unit tests with Fastify Tests API
- [ ] Create a agnostic solution for controllers
- [ ] Brenchmark this Docker Container solution against other candidates
- [ ] Create a script to automate integration with AWS Fargate and GCP Kubernetes
