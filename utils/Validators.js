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
  const nameVerify = validate.async({ name: name }, { name: nameConstraints });
  console.log(nameVerify);
  if (nameVerify === undefined) {
    return;
  }
  return alert(...nameVerify.name);
};

export const emailValidator = (email) => {
  const emailConstraints = {
    presence: { allowEmpty: false },
  };
  if (email !== "") {
    emailConstraints.email = true;
  }
  const emailVerify = validate({ "email": email },{"email" :emailConstraints});
  console.log(emailVerify);
//   if (emailVerify === undefined) {
//     return;
//   }
//   return alert("Please Enter a Valid Email")
  
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
      console.log(passwordVerify);

};
