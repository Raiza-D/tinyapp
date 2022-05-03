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
}

function getUserByEmail(users, userEmail) {
  for (const userID in users) {
    if (users[userID]["email"] === userEmail) {
      return true;
    }
  }
  return false;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "diswasher-funk"
  }
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
  const userID = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userID]
  };
  if (!templateVars.user) {
    templateVars.urls = [];
  }
  res.render("urls_index", templateVars);
});

// Handles request when user clicks on 'Create New URL'
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID]
  };
  if (!templateVars.user) {
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
  const userID = req.cookies["user_id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userID]
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

// Handles request to log in
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  let emailExists = getUserByEmail(users, userEmail);

  if (emailExists === false) {
    res.statusCode = 403;
    console.log(`Error. Status Code: ${res.statusCode}. Email cannot be found.`)
    return res.send(
      `Error. Status Code: ${res.statusCode}. Email cannot be found.`
    );
  }
  

  // Set cookie upon loggin in successfully
  // res.cookie("user_id", userName);
  
  res.redirect("/urls");
});

// Handles request to logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Handles request to register. Renders page with registration form
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID]
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }
});

// Handles POST request when user clicks Register button on register page
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  let emailExists = getUserByEmail(users, userEmail);

  console.log(emailExists);
  console.log(users);

  if (userEmail === "" || userPassword === "") {
    res.statusCode = 400;
    console.log(
      `Error. Status code: ${res.statusCode}. Email and password fields cannot be empty.`);
    return res.send(
      `Error. Status code: ${res.statusCode}. Email and password fields cannot be empty.`);
  }

  if (emailExists === true) {
    res.statusCode = 400;
    console.log(
      `Error. Status code: ${res.statusCode}. Account already exists for this email.`
    );
    return res.send(
      `Error. Status code: ${res.statusCode}. Account already exists for this email.`
    );
  }

  const uniqueUserID = generateRandomString();

  users[uniqueUserID] = {
    id: uniqueUserID,
    email: userEmail,
    password: userPassword,
  };
  console.log(users);

  res.cookie("user_id", uniqueUserID);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user: users[userID],
  };
  res.render("urls_login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
