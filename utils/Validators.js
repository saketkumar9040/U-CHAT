import { validate } from "validate.js";

export const nameVaildator = (name) => {
  const nameConstraints = {
    presence: { allowEmpty: false },
  };
  if (name !== "") {
    nameConstraints.format = {
      pattern: "[a-z]+",
      flags: "i",
      message: "can only be in letters",
    };
  }
  const nameVerify = validate({ name: name }, { name: nameConstraints });
  // console.log(nameVerify);
  // if (nameVerify === undefined) {
  //   return;
  // }
  return nameVerify;
};

export const emailValidator = (email) => {
  const emailConstraints = {
    presence: { allowEmpty: false },
  };
  if (email !== "") {
    emailConstraints.email = true;
  }
  const emailVerify = validate({ "email": email },{"email" :emailConstraints});
  // console.log(emailVerify);
  // if (emailVerify === undefined) {
  //   return;
  // }
  return emailVerify
  
};

export const numberValidator = (number) => {
  const numberConstraints = {
    presence: { allowEmpty: false },
  };
  if (number !== "") {
    numberConstraints.format= {
      pattern: "[0-9]+",
      message: "can only be number",
      }

}
      const numberVerify = validate({ "number": number },{"number" :numberConstraints});
      // console.log(numberVerify);
      return numberVerify;

};

export const passwordValidator = (password) => {
    const passwordConstraints = {
        presence: { allowEmpty: false },
      };
      if(password !== ""){
        passwordConstraints.length = {
            minimum:6,
            message:"must be atleast 6 character"
        }
      }
      const passwordVerify = validate({ "password": password },{"password" :passwordConstraints});
      // console.log(passwordVerify);
      return passwordVerify;

};
