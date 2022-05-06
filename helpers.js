/* Contains all helper functions */

const bcrypt = require("bcryptjs");

// Generates random alphanumeric string
const generateRandomString = function() {
  return (Math.random() + 1).toString(36).substring(6);
};

// Checks if email entered upon registering or logging in exists within users database.
// If yes, return user object. If no, return null.
const getUserByEmail = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }

  return null;
};

// Authenticates user upon login. Checks if email exists, then checks password.
// If condition met, return user object within database. Otherwise, return null.
const authenticateUser = function(users, emailEntered, passwordEntered) {
  let userFound = getUserByEmail(emailEntered, users);
  if (userFound && bcrypt.compareSync(passwordEntered, userFound.password)) {
    return userFound;
  }

  return null;
};

// Checks urlDatabase for any shortURLs that belong to given userID.
// Adds those URLS into empty urls object and returns final urls object
const getUrlsForUser = function(urlDatabase, userID) {
  const urls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      urls[shortURL] = { longURL: urlDatabase[shortURL].longURL };
    }
  }
  
  return urls;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  authenticateUser,
  getUrlsForUser
};