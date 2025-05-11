const validationUserUpdate = (clientData) => {
  if (!clientData) throw new Error("Invalid Data");

  const updateAllowed = ["firstName", "lastName", "age"];

  const isUpdateAllowed = Object.keys(clientData).every((key) =>
    updateAllowed.includes(key)
  );

  if (!isUpdateAllowed) throw new Error("Invalid update fields");

  const {firstName, lastName, age} = clientData;
  if (firstName) {
    if (firstName.length < 2 || firstName.length > 12) {
        throw new Error ("length invalid");
    }
  }

  if (lastName) {
    if (lastName.length >= 15) throw new Error ("length invalid");
  }

  if (age < 18 || age > 120) throw new Error ("enter a valid age");
};

module.exports = validationUserUpdate;
