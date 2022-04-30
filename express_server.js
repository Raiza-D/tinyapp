/* TO-DO BEFORE PROJECT SUBMISSION:
-Refactor
-Re-arrange order of get and post codes. Keep same paths together.
-Add comments where necessary
*/

const express = require("express");
const app = express();
const PORT = 8080;

function generateRandomString() {
  return (Math.random() + 1).toString(36).substring(6);
};

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Handles request when user clicks on 'Create New URL'
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  };
  res.render("urls_show", templateVars);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
