// Personal API Key for OpenWeatherMap API
let baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
let apiKey = ",&appid=0f6739781d6efad5bbf6599818e2d675&units=metric";
let server = "http://127.0.0.1:8000";
let error = document.getElementById("error");
// the Date 
//January is 0, so I add 1
let today = new Date();
let dayDate = today.getDate() + '/' + today.getMonth() + '1' + '/' + today.getFullYear();
// Event listener to add function to existing HTML DOM element
const sendData = () => { 
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  getnewData(zip).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description, icon }],
      } = data;
      const info = {
        dayDate,
        city,
        temp: Math.round(temp),
        icon,
        description,
        feelings,
      };
      post_Data(server + "/add", info);
      update_AppUI();
      document.getElementById('entry').style.opacity = 1;
    }
  });
};
// Function called by event listener
document.getElementById("generate").addEventListener("click", sendData);
//Function to GET Web API Data
const getnewData = async (zip) => {
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
const post_Data = async (url = "", info = {}) => {
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
  } catch (error) {console.log(error);}
};
/* Function to GET Project Data */
const update_AppUI = async () => {
  const res = await fetch(server + "/all");
  try {
    const savedData = await res.json();
    document.getElementById("temp").innerHTML = savedData.temp + '&degC';
    document.getElementById("icon").src = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
    document.getElementById("city").innerHTML = savedData.city;
    document.getElementById("description").innerHTML = savedData.description;
    document.getElementById("date").innerHTML = savedData.dayDate;
    document.getElementById("content").innerHTML = savedData.feelings;
  } catch (error) {console.log(error);}
};