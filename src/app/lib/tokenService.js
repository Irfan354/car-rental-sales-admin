//Session Storage mangt of JWt Token

// tokenService.js
// set Token
export const setToken = (token, user) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
};

// get Token
export const getToken = () => sessionStorage.getItem("token");
export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// remove token
export const removeToken = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};
