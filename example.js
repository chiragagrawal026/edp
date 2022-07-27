const { AuditLogBlockchain } = require('./chain.js');
const dotenv = require('dotenv')
const logger = require('elogger');

dotenv.config();
//  connect to database
console.log(process.env.MONGODB_URL)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


/* eslint-disable no-underscore-dangle */
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();



app.use(express.json({ extended: false }));
app.use(cors());

// app.use('/api', require('./routes/api/company'));
// app.use('/api/user', require('./routes/api/user'));
// app.use('/api/company', require('./routes/api/company'));
// app.use('/api/invoice', require('./routes/api/invoice'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    // eslint-disable-next-line no-console
    console.log(`Server is up on ${PORT}`);
});

app.post('/', (async (req, res) => {
    let blockChain = new AuditLogBlockchain();
    await blockChain.initialize();

    // for (let idx = 1; idx <= 10; idx++) {
    let payload = {
        user: "1",
        ip: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97',
        action: 'TEST_ACTION',
        rtype: 'TEST',
        ref_id: 'TEST_00' + 56,
        created_on: new Date().getTime()
    };
    // logger.info(`New Block Request: ${payload.ref_id}`);
    let entry = await blockChain.createTransaction(payload);
    // logger.info(`New Transaction: ${entry.id}`);
    // }

    let status = await blockChain.checkChainValidity();
    logger.info(`Chain Status: ${(status) ? 'SUCCESS' : 'FAILED'}`);
    // process.exit(0);
    return res.send("got")
}));


app.get('/', async (req, res) => {
    let offset = 0;
    let limit = 10;
    let blockChain = new AuditLogBlockchain();
    // await blockChain.initialize();
    if (req.query.offset) {
        offset = Number(req.query.offset);
    }

    if (req.query.limit) {
        limit = Number(req.query.limit);
    }

    const resp = await blockChain.getData(offset, limit)

    res.json(resp);

});