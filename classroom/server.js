const express = require("express");
const app = express();
const session = require("express-session"); // Correct package
const flash = require("connect-flash");
const path = require('path');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using HTTPS
}


// Middleware for session management
app.use(session(sessionOption));
app.use(flash());


app.use((req, res, next)=> {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
})


app.get("/register", (req, res)=> {
  let {name="Anonymus"} = req.query;
  req.session.name = name;
  if(name === "Anonymus") {
    req.flash("error", "User is not Registered!!")
  } else {
    req.flash("sucess", "Users Registered Sucessfilly!!");
  }
  
  res.redirect("/hello");
})

app.get("/hello", (req, res)=> {
  // res.send(`Hello ${req.session.name}, welcome to ...`);

  res.render("page.ejs", {name : req.session.name});
})



// app.get("/reqcount", (req, res)=> {
//   if(req.session.count) req.session.count++;
//   else req.session.count = 1;
//   res.send(`You sent a req ${req.session.count} times`);
// });


// app.get("/test", (req, res) => {
//     res.send("Test Successful");
// });

app.listen(3000, () => {
    console.log(`Server is listening on port 3000`);
});
