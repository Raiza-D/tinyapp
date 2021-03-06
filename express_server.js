const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["abc123", "random"]
  })
);

const bcrypt = require("bcryptjs");

const { generateRandomString, getUserByEmail, authenticateUser, getUrlsForUser } = require("./helpers.js");

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Handle request when user navigates to index page
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  let userUrls = getUrlsForUser(urlDatabase, userID);

  const templateVars = {
    urls: userUrls,
    user: users[userID],
  };

  if (!templateVars.user) {
    res.status = 400;
    return res.redirect("/login");
  }

  res.render("urls_index", templateVars);
});

// Handles request when user clicks on Submit button to generate shortURL
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const loggedInUser = users[userID];

  if (!loggedInUser) {
    return res.status(401).send("Error. Must login or register for an account.\n");
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const url = { longURL, userID };
  urlDatabase[shortURL] = url;

  res.redirect(`/urls/${shortURL}`);
});

// Handles request when user clicks on 'Create New URL'
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    user: users[userID]
  };

  if (!templateVars.user) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

// Handles request when user navigates to specified short URL page
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const loggedInUser = users[userID];

  if (!loggedInUser) {
    return res.status(401).send("Error. Must login or register for an account.\n");
  }

  const user = users[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user };

  res.render("urls_show", templateVars);
});

// Handles request when user clicks on Edit button on urls_show page to update longURL
app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const loggedInUser = users[userID];

  if (!loggedInUser) {
    return res.status(401).send("Error. Must login or register for an account.\n");
  }

  const shortURL = req.params.shortURL;
  const revisedURL = req.body.longURL;
  urlDatabase[shortURL].longURL = revisedURL;
  res.redirect("/urls");
});

// Handles request when user clicks on delete button on index page
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const loggedInUser = users[userID];

  if (!loggedInUser) {
    return res.status(401).send("Error. Must login or register for an account.\n");
  }

  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Handles request when user navigates to /u/:shortURL path on browser
// User directed to longURL website
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    return res.send("shortURL entered invalid.");
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Handles request when user clicks on 'Login' link top right of navigation bar
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    user: users[userID],
  };
  res.render("urls_login", templateVars);
});

// Handles request when user clicks on 'Login' button in Login page
app.post("/login", (req, res) => {
  const emailEntered = req.body.email;
  const passwordEntered = req.body.password;

  let userObj = authenticateUser(users, emailEntered, passwordEntered);

  if (!userObj) {
    res.statusCode = 403;
    return res.send(`Error. Status Code: ${res.statusCode}. Invalid credentials.`);
  }

  // Set cookie upon logging in successfully
  req.session.user_id = userObj.id;
  
  res.redirect("/urls");
});

// Handles request to logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Handles request to register. Renders page with registration form
app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    user: users[userID]
  };

  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }
});

// Handles request when user clicks Register button on register page
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(userPassword, 10);

  let user = getUserByEmail(userEmail, users);

  if (!userEmail || !userPassword) {
    res.statusCode = 400;
    return res.send(`Error. Status code: ${res.statusCode}. Email and password fields cannot be empty.`);
  }

  if (user) {
    res.statusCode = 400;
    return res.send(`Error. Status code: ${res.statusCode}. Account already exists for this email.`);
  }

  const uniqueUserID = generateRandomString();

  users[uniqueUserID] = {
    id: uniqueUserID,
    email: userEmail,
    password: hashedPassword,
  };

  req.session.user_id = uniqueUserID;
  res.redirect("/urls");
});

// Server listening to provided port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
