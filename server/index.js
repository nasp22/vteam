const express = require('express');
const app = express();

const port= 1337;

app.get('/', (req, res) => {
    const routes = require('./routes/routes.json');

    res.json(routes);
});

app.get('/status', (req, res) => {
    const rows = require('./data/status.json');

    res.json(rows);
});

app.listen(port, () => console.log(`Elspackcyklar-app listening on port ${port}!`));
