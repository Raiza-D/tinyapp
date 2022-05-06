const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

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

describe("getUserByEmail", function() {
  it("should return the user object that contains the valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    console.log(user);
    const expectedValidUser = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    }
    assert.deepEqual(user, expectedValidUser);
  });

  it("should return null if the email does not exist within our users database", function() {
    const user = getUserByEmail(testUsers, "someperson@gmail.com");
    const expectedOutput = null;
    assert.equal(user, expectedOutput);
  });

});