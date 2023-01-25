import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "./weatherPage.css";

function WeatherPage() {
  const [weatherData, setWeatherData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/weather?page=${page}`)
      setWeatherData(data);
    };
    fetchData();
  }, [page]);


  return (
    <>
      {(weatherData.length < 0) ? (
        <div className="loading" >
          <h1>Loading...</h1>
        </div>) : (
        <div className="main-container">
          <div className="map-container">
            <MapContainer center={[22, 81]} zoom={5}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {weatherData.map((city) => (
                <Marker key={city.name} position={[city.coord.lat, city.coord.lon]}>
                  <Popup>
                    <img alt="icon" src={`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}></img>
                    <div>
                      <h3>{city.name}</h3>
                      <p>{city.main.temp} °C</p>
                      <p>{city.weather[0].main}</p>
                    </div>

                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )
      }
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === 3}>Next</button>
      </div>

    </>

  );
}

export default WeatherPage;
