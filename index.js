const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// Define the interval (in milliseconds) to refresh the data
const refreshInterval = 5 * 60 * 1000; // 5 minutes
let weatherData = [];
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather?q=';
const cities = ["Mumbai","Delhi","Bangalore","Hyderabad","Kolkata","Chennai","Ahmedabad","Ludhiana","Surat","Jaipur","Lucknow","Jabalpur","Indore","Nagpur","Vadodara","Patna","Secunderabad","Coimbatore","Gwalior","Dehradun","Kochi","Chandigarh","Panaji","Kanpur","Guwahati","Pune","Bhopal","Ranchi","Amravati","Agra"];
let currentPage = 1;

app.get("/weather", async (req, res) => {
  let page = req.query.page || currentPage;
  let perPage = 10;  // number of items per page
  let skip = (page - 1) * perPage;
  let paginatedCities = cities.slice(skip, skip + 10);
  currentPage = page;

  try {
      const data = await Promise.all(paginatedCities.map(city => axios.get(`${apiEndpoint}${city}&units=metric&appid=${process.env.API_KEY}`)));
      weatherData = data.map(res => res.data);
      res.json(weatherData);
  } catch (error) {
      console.error(error);
  }
 });

//calling the api every 5 minutes
setInterval(() => {
  axios.get(`http://localhost:5000/weather?page=${currentPage}`)
  .then(response => {
      weatherData = response.data;
  })
  .catch(error => {
      console.error(error);
  });
},refreshInterval);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function(_,res){
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function(err){
      res.status(500).send(err);
    }
  );
});
