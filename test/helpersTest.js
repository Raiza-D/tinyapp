const { assert } = require("chai");

const { generateRandomString, getUserByEmail, getUrlsForUser } = require("../helpers.js");

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

const testUrlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },

  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },

  "k71hb9": {
    longURL: "https://www.thelasthunt.com/",
    userID: "userRandomID"
  }
};


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

describe("getUrlsForUser", function () {
  it("should return an object if there are urls in the database belonging to a given user", function () {
    const urls = getUrlsForUser(testUrlDatabase, "userRandomID");
    const expectedUrls = {
      b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
      },
      "k71hb9": {
        longURL: "https://www.thelasthunt.com/"
      }
    }
    assert.deepEqual(urls, expectedUrls);
  });
});