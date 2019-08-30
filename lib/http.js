var axios = require("axios");

const http = axios.create({
  baseURL: "https://www.99lib.net",
  headers: {
    "Content-Type": "text/html"
  },
  timeout: 15000
});
const post = function(url, param) {
  param =
    "_request_data=" +
    encodeURIComponent(
      JSON.stringify({
        parameter: param
      })
    );
  return new Promise((resolve, reject) => {
    http
      .post(url, param)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const get = function(url, param) {
  return new Promise((resolve, reject) => {
    http
      .get(url, {
        params: param
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const $http = {
  post,
  get
};

module.exports = $http;
