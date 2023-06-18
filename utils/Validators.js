import { validate } from "validate.js";

export const nameVaildator = (name) => {
  const nameConstraints = {
    presence: { allowEmpty: false },
  };
  if (name !== "") {
    nameConstraints.format = {
      pattern: "^[a-zA-Z ]*$",  // includes alphabets with spaces
      flags: "i",
      message: "can only be in letters",
    };
  }
  const nameVerify = validate({ name: name }, { name: nameConstraints });
  return nameVerify;
};

export const emailValidator = (email) => {
  const emailConstraints = {
    presence: { allowEmpty: false },
  };
  if (email !== "") {
    emailConstraints.email = true;
  }
  const emailVerify = validate({ email: email }, { email: emailConstraints });
  return emailVerify;
};

export const numberValidator = (number) => {
  const numberConstraints = {
    presence: { allowEmpty: false },
  };
  if (number !== "") {
    numberConstraints.format = {
      pattern: "[0-9]+",
      message: "can only be number",
    };
  }
  const numberVerify = validate(
    { number: number },
    { number: numberConstraints }
  );
  return numberVerify;
};

export const passwordValidator = (password) => {
  const passwordConstraints = {
    presence: { allowEmpty: false },
  };
  if (password !== "") {
    passwordConstraints.length = {
      minimum: 6,
      message: "must be atleast 6 character",
    };
  }
  const passwordVerify = validate(
    { password: password },
    { password: passwordConstraints }
  );
  return passwordVerify;
};
