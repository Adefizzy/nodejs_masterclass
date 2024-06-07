const _data = require("./data");
const helpers = require("./helpers");
const handler = {};

handler.users = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.includes(data.method)) {
    handler._users[data.method](data, callback);
  } else {
    callback(405); // method not allowed.
  }
};

// Container for users subMethods

handler._users = {};

const getFieldStatus = (field, type) => {
  return typeof field === type && Boolean(field);
};

// Required Fields: firstName, lastName, phone, password, tosAgreement
handler._users.post = async function (data, callback) {
  const { firstName, lastName, phone, password, tosAgreement } = data.body;
  const isValidField =
    getFieldStatus(firstName, "string") &&
    getFieldStatus(lastName, "string") &&
    getFieldStatus(phone, "string") &&
    getFieldStatus(password, "string") &&
    getFieldStatus(tosAgreement, "boolean");

  if (isValidField) {
    try {
      const user = await _data.read("users", phone);
      if (!user) {
        const hashedPassword = helpers.hash(password);
        if (!hashedPassword) {
          callback(500, { Error: "Error hashing password" });
        }
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hashedPassword,
          tosAgreement,
        };

        await _data.create("users", phone, userObject);
        callback(200, { user: { firstName, lastName, phone } });
      } else {
        callback(401, { Error: "User with the phone number exist" });
      }
    } catch (error) {
      callback(500, { Error: error });
    }
  } else {
    callback(401, { Error: "Missing required field" });
  }
};

handler._users.get = async function (data, callback) {
  const { phone } = data.queryStringObj;

  if (!getFieldStatus(phone, "string")) {
    return callback(400, "Missing required field");
  }

  try {
    const user = await _data.read("users", phone);
    if (!user) {
      callback(400, { Error: "user with phone does not exist" });
      return;
    }
    delete user.password;
    callback(200, { user });
  } catch (error) {
    callback(400, error);
  }
};
handler._users.put = async function (data, callback) {
  const { phone } = data.queryStringObj;
  const { firstName, lastName, password } = data.body;

  if (getFieldStatus(phone, "string")) {
    if (
      getFieldStatus(firstName, "string") ||
      getFieldStatus(lastName, "string") ||
      getFieldStatus(password, "string")
    ) {
      try {
        const user = await _data.read("users", phone);
        if (user) {
          const newUser = {
            ...user,
            firstName: firstName ?? user.firstName,
            lastName: lastName ?? user.lastName,
            password: password ? helpers.hash(password) : user.password,
          };

          await _data.update("users", phone, newUser);
          delete newUser.password
          callback(200, {user: newUser})
        } else {
          callback(400, { Error: "User with the phone does not exist" });
        }
      } catch (error) {
        callback(500, { Error: error });
      }
    }else{
        callback(400, {Error: 'Empty body'})
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
handler._users.delete = function (data, callback) {};

handler.notFound = function (data, callback) {
  console.log({ data });
  callback(404);
};

module.exports = handler;
