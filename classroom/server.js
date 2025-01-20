const express = require("express");
const app = express();

const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const cookieParser = require("cookie-parser");


app.use(cookieParser("password"));


app.get("/getsignedcookie", (req, res)=> {
    res.cookie("made-in", "India", {signed: true});
    res.send("signed Cookie Sent.")
});

app.get("/getcookies", (req, res)=> {
    res.cookie("Greet", "Namaste");
    res.cookie("madeIn", "India");
    res.send("Send you some cookies");
})

app.get("/verify", (req, res)=> {
    console.log(req.signedCookies);
    res.send("verified");
});


app.get("/greet", (req, res)=> {
    let {name = "anonymus"} = req.cookies;
    res.send(`Hii My name is ${name}`);
});


app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hii I'm Root.");
  });

  app.use("/users", users);
  app.use("/posts", posts);

app.listen(3000, () => {
  console.log(`Server is listning t port ${3000}`);
});
