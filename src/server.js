const express = require("express");

const { getIndexedPath } = require('./getIndexedPath')

const app = express();
const port = 3000;

app.use(express.json());

app.post('/parse', async (req, res) => {
    const domainName = req.body.domainName;

    if (!domainName) {
        res.json([])
    }

    res.json(await getIndexedPath(domainName));
})

app.listen(port)

