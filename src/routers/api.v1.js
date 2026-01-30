import express from "express";
import { getDb, ObjectId } from "../utils/mongo.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.send("VPW Data Service is up and running...");
});

router.post("/projects", async (req, res) => {
  const db = await getDb();
  await db.collection("projects").insertOne(req.body);
  let response;
  if (req.body.actionType === "checkin") {
    response =
      `**CHECKED IN** by <@${req.body.userId}>\n` +
      `**Link:** <${req.body.link}>\n` +
      `**Version:** ${req.body.version}\n` +
      `**Comments:** ${req.body.comments}\n`;
  } else {
    response = `**CHECKED OUT** by <@${req.body.userId}>\n`;
  }
  res.status(200).send(response);
});

router.get("/projects/:channelId", async (req, res) => {
  const db = await getDb();
  const channelId = req.params.channelId;
  const filter = { channelId: channelId };
  const projects = await db.collection("projects").find(filter).toArray();
  res.send(projects);
});

router.delete("/projects/:channelId", async (req, res) => {
  const db = await getDb();
  const channelId = req.params.channelId;
  const userId = req.query.userId;
  const actionId = req.query.actionId;
  await db
    .collection("projects")
    .deleteOne({ _id: new ObjectId(actionId) }, null);
  const response = `**REVERTED LAST ACTION** by <@${userId}>\n`;
  res.status(200).send(response);
});

export default router;
