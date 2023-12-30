const mongoHelper = require('../helpers/mongoHelper');
const { ScorePipelineHelper, ScorePipelineHelper2, SearchPipelineHelper, AllPipelineHelper } = require('../helpers/pipelineHelper');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('VPW Data Service is up and running...');
})

router.post('/projects', async (req, res) => {
    await mongoHelper.insertOne(req.body, 'projects');
    res.status(200).send('Commit saved.');
});

router.get('/projects/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    var filter = new Object({channelId: parseInt(channelId)});
    const projects = await mongoHelper.find(filter, 'projects');
    res.send(projects);
});

router.put('/projects/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    var filter = new Object({channelId: parseInt(channelId)});
    filter.userName = req.query.userName;
    filter.action = req.query.action;
    filter.locked = req.query.locked;
    await mongoHelper.updateOne(filter, { $set: req.body}, null, 'projects');
    res.status(200).send('Commit updated.');
});

module.exports = router;