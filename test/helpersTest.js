const { assert } = require("chai");

const { generateRandomString, getUserByEmail, authenticateUser } = require("../helpers.js");

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

describe("authenticateUser", function () {
  it("should return the corresponding user object if email exists and password correct", function() {
    const user = authenticateUser(testUsers, "user@example.com", "purple-monkey-dinosaur");
    const expectedUser = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur",
    }
    assert.deepEqual(user, expectedUser);
  });
});


describe("generateRandomString", function() {
  it("should return a random alphanumeric string", function() {
    const alphaNum = generateRandomString();
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