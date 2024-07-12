import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `http://localhost:5000/weather?location=${location}`;
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation('');
    }
  };

  const saveFavorite = async () => {
    try {
      await axios.post('http://localhost:5000/favorites', {
        location: data.name,
        data: data,
      });
      fetchFavorites();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${id}`);
      fetchFavorites();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name &&
          <div className="bottom">
            <button onClick={saveFavorite} style={{color:"white",background:"black",height:"30px",marginTop:"17px"}}>Add to Favorites</button>
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }

               <div className="favorites" style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Favorite Places</h2>
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="favorite"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p style={{ fontSize: '18px', margin: 0 }}>{fav.location}</p>
              <button
                onClick={() => deleteFavorite(fav._id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  background: '#ff5c5c',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
