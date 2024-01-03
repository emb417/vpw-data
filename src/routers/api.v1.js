const { parse } = require('dotenv');
var ObjectId = require('mongodb').ObjectId; 
const mongoHelper = require('../helpers/mongoHelper');
const { ScorePipelineHelper, ScorePipelineHelper2, SearchPipelineHelper, AllPipelineHelper } = require('../helpers/pipelineHelper');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('VPW Data Service is up and running...');
})

router.post('/projects', async (req, res) => {
    await mongoHelper.insertOne(req.body, 'projects');
    let response;
    if(req.body.actionType === 'checkin') {
        response = `**CHECKED IN** by <@${req.body.userId}>\n` +
                    `**Link:** <${req.body.link}>\n` +
                    `**Version:** ${req.body.version}\n` +
                    `**Comments:** ${req.body.comments}\n`;
    } else {
        response = `**CHECKED OUT** by <@${req.body.userId}>\n`;
    }
    res.status(200).send(response);
});

router.get('/projects/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    var filter = new Object({channelId: channelId});
    const projects = await mongoHelper.find(filter, 'projects');
    res.send(projects);
});

router.delete('/projects/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    const userId = req.query.userId;
    const actionId = req.query.actionId
    await mongoHelper.deleteOne({_id: new ObjectId(actionId)}, null, 'projects');
    let response;
    response = `**REVERTED LAST ACTION** by <@${userId}>\n`;
    res.status(200).send(response);
});

module.exports = router;