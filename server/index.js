const express = require("express");
const verifyProof = require("../utils/verifyProof");
const MerkleTree = require("../utils/MerkleTree");
const niceList = require("../utils/niceList");

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT =
  "ddd59a2ffccddd60ff47993312821cd57cf30f7f14fb82937ebe2c4dc78375aa";

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!");
});

app.post("/", (req, res) => {
  const body = req.body;
  console.log(typeof body);
  console.log(body.name);
});

app.post("/gift", (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;
  console.log(typeof body);
  console.log(body.name);

  // TODO: prove that a name is in the list
  const merkleTree = new MerkleTree(niceList);

  // get the root
  const root = merkleTree.getRoot();
  console.log(root);

  const index = niceList.findIndex((n) => n === body.name);
  const proof = merkleTree.getProof(index);

  //
  const isInTheList = verifyProof(proof, body.name, MERKLE_ROOT);
  if (isInTheList) {
    console.log("You got a toy robot!");

    return res.status(200).send({ result: "You got a toy robot!" });
  } else {
    console.log("You are not on the list :(");
    return res.status(200).send({ result: "You are not on the list :(" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
