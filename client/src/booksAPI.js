const axios = require('axios');

const booksAPI = {
  searchBook: async function (titleArr) {
    const query = titleArr.join('+');

    try {
      const response = await axios.get(`http://openlibrary.org/search.json?title=${query}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },

  searchAuthor: async function (titleArr) {
    const query = titleArr.join('+');

    try {
      const response = await axios.get(`http://openlibrary.org/search.json?author=${query}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },
};

module.exports = booksAPI;
