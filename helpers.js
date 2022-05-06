/* Contains all helper functions */

/* Function scans users object. Checks if email entered upon registering or logging in exists.
If yes, return user nested object within users database.
If no, value is 'undefined' */
const getUserByEmail = function(users, email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }

  return null;
};

module.exports = {
  getUserByEmail
};