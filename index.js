// This package implements an incredibly simple in-memory replicache
// datalayer that does nothing but store every mutation it receives
// and echo it back out in the client view.
import express from "express";

const app = express();
const port = 3001;

app.use(express.json());

const lastMutationIDs = {};
const data = {
  init: "hello world",
};

let nextID = 0;

app.post("/replicache-client-view", (req, res) => {
  console.log("/replicache-client-view", req.body);
  let body = null;
  try {
    const { clientID } = req.body;
    if (!clientID) {
      res.status(400);
      res.send("Invalid request - clientID is required");
      return;
    }
    const lastMutationID = lastMutationIDs[clientID] || 0;
    body = {
      lastMutationID,
      clientView: data,
    };
    res.send();
  } finally {
    console.log("/replicache-client-view", body);
    res.end();
  }
});

app.post("/replicache-batch", (req, res) => {
  console.log("> /replicache-batch", req.body);
  try {
    const { clientID, mutations } = req.body;
    const invalidRequest = (msg) => {
      console.warn("Invalid request - " + msg);
      res.status(400);
      res.send("Invalid request - " + msg);
    };
    if (!clientID || !Array.isArray(mutations)) {
      invalidRequest("invalid clientID or mutations");
      return;
    }

    for (const mutation of mutations) {
      const lastMutationID = lastMutationIDs[clientID] || 0;
      const { id: mutationID, name, args } = mutation;
      if (!mutationID || !name || typeof args == "undefined") {
        invalidRequest("invalid mutation");
        return;
      }
      const expectedMutationID = lastMutationID + 1;
      if (mutationID < expectedMutationID) {
        // This ID has already been processed, nothing to do!
        console.log("This mutation has already been processed - skipping");
        continue;
      }
      if (mutationID > expectedMutationID) {
        invalidRequest(
          "Unexpected mutation ID from the future - client not following protocol"
        );
        return;
      }

      // Note: in a real system, with persistence, these two operations
      // must be transactional. Neither should occur w/o the other occuring.
      data[`m/${nextID++}`] = mutation;
      lastMutationIDs[clientID] = expectedMutationID;
    }
  } finally {
    res.end();
    console.log("< /replicache-batch");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
