const express = require("express"); //express모듈를 가져온다
const app = express(); //express의 펑션을 가지고 새로운 express app을 만들고
const port = 5000; // 아무렇게나 해도 된다.

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://Dongmin:qwe9093265!@boilerplate-fi1w3.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connecter..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
