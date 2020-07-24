const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main_index.html");
})

app.listen(1337, () => {
  console.log("The server is up and running!");
});
