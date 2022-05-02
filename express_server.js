/* TO-DO BEFORE PROJECT SUBMISSION:
-Refactor
-Re-arrange order of get and post codes. Keep same paths together.
-Add comments where necessary
*/

const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

function generateRandomString() {
  return (Math.random() + 1).toString(36).substring(6);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Handle request when user navigates to index page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  if (!templateVars.username) {
    templateVars.urls = [];
  }
  res.render("urls_index", templateVars);
});

// Handles request when user clicks on 'Create New URL'
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  if (!templateVars.username) {
    return res.redirect("/urls");
  }
  res.render("urls_new", templateVars);
});

// Handles request when user clicks on Submit button to generate shortURL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`);
});

// Handles request when user navigates to urls_show page and displays user-provided shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars)
});

// Handles request when user specifies shortURL path on browser. User directed to longURL website
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// Handles request when user clicks on delete button on index page
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Handles request when user clicks on Submit button on urls_show page to update longURL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const revisedURL = req.body.longURL;
  urlDatabase[shortURL] = revisedURL;
  res.redirect("/urls");
});

// Handles request to log in
app.post("/login", (req, res) => {
  const userName = req.body.username;
  res.cookie("username", userName);
  res.redirect("/urls");
});

// Handles request to logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// Handles request to register. Renders page with registration form
app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
