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

/* Function scans users object. Checks if email entered upon registering or logging in exists.
If yes, return user nested object within users database.
If no, value is 'undefined' */
function getUserByEmail(users, email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
}

/* Function to authenticate user when logging in. Loops through users object.
Calls getUserByEmail to check if user email exists.
If yes, then compare password stored in database and compare with password entered.
Returns user nested object within users database.
If no, value return is 'undefined.' */
function authenticateUser(users, emailEntered, passwordEntered) {
  let userFound = getUserByEmail(users, emailEntered);
  if (userFound && userFound.password === passwordEntered) {
    return userFound;
 }
}

const getUrlsForUser = function(urlDatabase, userID) {
  const urls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      urls[shortURL] = { longURL: urlDatabase[shortURL].longURL };
    }
  }
  return urls;
};

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
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
  let userUrls = getUrlsForUser(urlDatabase, userID);
  
  const templateVars = {
    urls: userUrls,
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
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

// Handles request when user clicks on Submit button to generate shortURL
app.post("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const loggedInUser = users[userID];
  if (!loggedInUser) {
    return res.status(401).send("Error. Must login.\n");
  }

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const url = { longURL, userID };
  urlDatabase[shortURL] = url;
  res.redirect(`/urls/${shortURL}`);
});

// Handles request when user navigates to urls_show page and displays user-provided shortURL
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});

// Handles request when user specifies shortURL path on browser. User directed to longURL website
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    return res.send("shortURL entered invalid.");
  }

  const longURL = urlDatabase[shortURL].longURL;
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
  urlDatabase[shortURL].longURL = revisedURL;
  res.redirect("/urls");
});

// Handles request to log in
app.post("/login", (req, res) => {
  const emailEntered = req.body.email;
  const passwordEntered = req.body.password;

  let userObj = authenticateUser(users, emailEntered, passwordEntered);

  if (!userObj) {
    res.statusCode = 403;
    console.log(
      `Error. Status Code: ${res.statusCode}. Invalid credentials.`
    );
    return res.send(
      `Error. Status Code: ${res.statusCode}. Invalid credentials.`
    );
  }

  // Set cookie upon logging in successfully
  res.cookie("user_id", userObj.id);
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

  let user = getUserByEmail(users, userEmail);

  console.log(user);
  console.log(users);

  if (userEmail === "" || userPassword === "") {
    res.statusCode = 400;
    console.log(
      `Error. Status code: ${res.statusCode}. Email and password fields cannot be empty.`);
    return res.send(
      `Error. Status code: ${res.statusCode}. Email and password fields cannot be empty.`);
  }

  if (user) {
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
