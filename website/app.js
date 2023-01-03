// Personal API Key for OpenWeatherMap API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = ",&appid=0f6739781d6efad5bbf6599818e2d675&units=metric";
const server = "http://127.0.0.1:4000";
const error = document.getElementById("error");
// date
let d = new Date();
let newDate = d.getDate() + '.' + d.getMonth() + '1' + '.' + d.getFullYear();
// Event listener to add function to existing HTML DOM element
const generateData = () => { 
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  getWeatherData(zip).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description, icon }],
      } = data;
      const info = {
        newDate,
        city,
        temp: Math.round(temp),
        icon,
        description,
        feelings,
      };
      postData(server + "/add", info);
      updatingUI();
      document.getElementById('entry').style.opacity = 1;
    }
  });
};
// Function called by event listener
document.getElementById("generate").addEventListener("click", generateData);
//Function to GET Web API Data
const getWeatherData = async (zip) => {
  try {
    const res = await fetch(baseURL + zip + apiKey);
    const data = await res.json();
    if (data.cod != 200) {
// display the error message on UI
      error.innerHTML = data.message;
      setTimeout(_=> error.innerHTML = '', 2000)
      throw `${data.message}`;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
// Function to POST data
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });
  try {
    const newData = await res.json();
    console.log(`You just saved`, newData);
    return newData;
  } catch (error) {
    console.log(error);
  }
};
/* Function to GET Project Data */
const updatingUI = async () => {
  const res = await fetch(server + "/all");
  try {
    const savedData = await res.json();
    document.getElementById("date").innerHTML = savedData.newDate;
    document.getElementById("city").innerHTML = savedData.city;
    document.getElementById("temp").innerHTML = savedData.temp + '&degC';
    document.getElementById("icon").src = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
    document.getElementById("description").innerHTML = savedData.description;
    document.getElementById("content").innerHTML = savedData.feelings;
  } catch (error) {
    console.log(error);
  }
};