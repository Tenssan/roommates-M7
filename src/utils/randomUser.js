const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

//const roommatesFilePath = path.join(__dirname, "../roommates.json");

const getRandomUser = async () => {
  try {
    const response = await axios.get("https://randomuser.me/api");
    const user = response.data.results[0];
    const roommate = {
      id: uuidv4(),
      nombre: `${user.name.first} ${user.name.last}`,
      email: user.email,
      debe: Math.floor(Math.random() * 10) * 1500,
      recibe: Math.floor(Math.random() * 10) * 1500,
    };
    return roommate;
  } catch (error) {
    throw new Error("Error fetching random user");
  }
};

module.exports = { getRandomUser };
