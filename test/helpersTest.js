const { assert } = require("chai");

const { generateRandomString, getUserByEmail } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("generateRandomString", function() {
  it("should return a random alphanumeric string", function() {
    const alphaNum = generateRandomString();
    console.log(alphaNum);
    assert.isString(alphaNum);
  });
});

describe("getUserByEmail", function() {
  it("should return the user object that contains the valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedValidUser = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    }
    assert.deepEqual(user, expectedValidUser);
  });

  it("should return null if the email does not exist within our users database", function() {
    const user = getUserByEmail("someperson@gmail.com", testUsers);
    const expectedOutput = null;
    assert.equal(user, expectedOutput);
  });

});