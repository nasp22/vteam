const app = require('./index.js');

const PORT = process.env.PORT || 1337;

const server = app.listen(PORT, () => console.log(`Elspackcyklar-app listening on port ${PORT}!`));

module.exports = server;
