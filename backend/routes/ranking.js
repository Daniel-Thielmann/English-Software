const express = require("express");
const { db } = require("../firebase-config");

const router = express.Router();

router.get("/ranking", async (req, res) => {
  const snapshot = await db
    .collection("users")
    .orderBy("points", "desc")
    .limit(10)
    .get();

  const ranking = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    points: doc.data().points,
  }));

  res.json(ranking);
});

module.exports = router;
