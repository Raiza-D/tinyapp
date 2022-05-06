/* Contains all helper functions */

// Generates random alphanumeric string
const generateRandomString = function () {
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

/* Function to authenticate user when logging in. Loops through users object.
Calls getUserByEmail to check if user email exists.
If yes, then compare password stored in database and compare with password entered.
Returns user nested object within users database.
If no, value return is 'undefined.' */
const authenticateUser = function(users, emailEntered, passwordEntered) {
  let userFound = getUserByEmail(emailEntered, users);
  if (userFound && bcrypt.compareSync(passwordEntered, userFound.password)) {
    return userFound;
  }
  
  return null;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  authenticateUser
};