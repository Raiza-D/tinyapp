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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); // Show a certain view --> render. Pass variables into the view.
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`); // How did it know to use the urls_show template?
  // Line 44 is the same as running code within app.get("/urls/:shortURL").
  // When code jumps to Line 44, it will know to run app.get("/urls/:shortURL") because
  // of this part within Line 44: `urls/${shortURL}`
  // console.log(urlDatabase);
  // res.redirect("/urls"); // To be changed (Part 2)
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

    if (!longURL) { // longURL === undefined
      console.log("Cannot render page. Invalid shortURL");
      return res.redirect("http://www.google.com");
    }
  res.redirect(longURL); // res.redirect(/error) This will result in code jumping to Line 68.
});

app.get("/error", (req, res) => {
  res.render()// Create new  ejs template for an error). Or res.redirect to main page.
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/* To handle error of user inputs an invalid shortURL:
Path of ("/u/") render an error page that shows error message.
Path of ("u/someinvalidshorturl") render error page.
Rendering error page requires creating a new ejs template for handling errors and this page will
display.
Or re-direct to another page within app. Better to render an error page.
*/