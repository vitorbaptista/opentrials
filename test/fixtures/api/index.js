const fs = require('fs');
const path = require('path');
const nock = require('nock');

const swaggerApiUrl = process.env.SWAGGER_API_URL || 'http://localhost:10010/v1/swagger.yaml';
const url = swaggerApiUrl.slice(0, swaggerApiUrl.length - 'swagger.yaml'.length);
const swaggerPath = path.join(__dirname, 'swagger.yaml');

nock.disableNetConnect();

module.exports = nock(url)
  .get('/swagger.yaml')
  .reply(200, fs.readFileSync(swaggerPath, 'utf-8'));
