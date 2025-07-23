import React, { useState, useEffect } from 'react';
import {
  Search, Cloud, Sun, CloudRain, CloudDrizzle, Wind, Droplets, MapPin,
  Eye, Thermometer, Gauge, Sunrise, Sunset
} from 'lucide-react';

const WeatherApp = () => {
  const [searchValue, setSearchValue] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const apikey = "e450b0763d24571596b022544e630d41";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWeatherIcon = (main) => {
    const icons = {
      Clear: <Sun className="w-24 h-24 text-yellow-300 animate-pulse drop-shadow-lg" />,
      Clouds: <Cloud className="w-24 h-24 text-gray-200 drop-shadow-lg" />,
      Rain: <CloudRain className="w-24 h-24 text-blue-300 drop-shadow-lg" />,
      Drizzle: <CloudDrizzle className="w-24 h-24 text-blue-200 drop-shadow-lg" />,
      Mist: <Cloud className="w-24 h-24 text-gray-300 opacity-80 drop-shadow-lg" />,
      Snow: <Cloud className="w-24 h-24 text-white drop-shadow-lg" />,
      Thunderstorm: <CloudRain className="w-24 h-24 text-purple-300 animate-pulse drop-shadow-lg" />
    };
    return icons[main] || <Cloud className="w-24 h-24 text-gray-300 drop-shadow-lg" />;
  };

  const getWindDirection = (deg) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  const getWeatherBackground = (main, isDay = true) => {
    const backgrounds = {
      Clear: isDay 
        ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400'
        : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
      Clouds: 'bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800',
      Rain: 'bg-gradient-to-br from-gray-700 via-blue-800 to-indigo-900',
      Drizzle: 'bg-gradient-to-br from-gray-500 via-blue-600 to-blue-800',
      Mist: 'bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700',
      Snow: 'bg-gradient-to-br from-blue-100 via-blue-300 to-blue-600',
      Thunderstorm: 'bg-gradient-to-br from-purple-900 via-gray-900 to-black'
    };
    return backgrounds[main] || 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900';
  };

  const getOverlayPattern = (main) => {
    const patterns = {
      Clear: 'bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]',
      Clouds: 'bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_70%)]',
      Rain: 'bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]',
      Snow: 'bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:20px_20px]',
      Thunderstorm: 'bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.1)_0%,transparent_70%)]'
    };
    return patterns[main] || '';
  };

  const searchWeather = async () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}${searchValue}&appid=${apikey}`);
      const data = await res.json();
      if (res.status === 404) {
        setError('City not found. Please check the spelling and try again.');
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setError('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') searchWeather();
  };

  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;
  const weatherCondition = weatherData?.weather[0]?.main;

  return (
    <div className={`min-h-screen w-full ${weatherData ? getWeatherBackground(weatherCondition, isDay) : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900'} relative overflow-auto`}>
      {/* Weather-specific overlay pattern */}
      {weatherData && (
        <div className={`absolute inset-0 ${getOverlayPattern(weatherCondition)} opacity-30`}></div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {weatherCondition === 'Rain' && (
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-blue-200 opacity-60 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 1 + 0.5}s`
                }}
              />
            ))}
          </div>
        )}
        
        {weatherCondition === 'Snow' && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-80 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 min-h-screen flex flex-col">
        
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-6 mb-6 shadow-xl">
            <p className="text-white text-2xl font-light">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-white/80 text-lg">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center backdrop-blur-md bg-gray-500/30 rounded-full overflow-hidden border border-gray-300/40 shadow-xl">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a city..."
                className="flex-1 px-6 py-4 bg-transparent text-white text-lg placeholder-gray-200/70 outline-none"
              />
              <button onClick={searchWeather} disabled={loading} className="p-4 text-white hover:bg-gray-400/20 transition-colors">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-gray-300/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 max-w-md mx-auto p-4 text-center backdrop-blur-md bg-red-500/20 text-red-100 rounded-2xl border border-red-300/30">
              {error}
            </div>
          )}
        </div>

        {/* Weather Info */}
        {weatherData && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
            
            {/* Main Weather Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-8 shadow-xl text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-white/70" />
                  <h2 className="text-3xl font-light">{weatherData.name}</h2>
                  <span className="text-white/60 text-xl">({weatherData.sys?.country})</span>
                </div>

                <div className="mb-6">{getWeatherIcon(weatherData.weather[0].main)}</div>
                
                <h1 className="text-8xl font-thin mb-4">{Math.round(weatherData.main.temp)}°</h1>
                <p className="text-white/90 text-xl capitalize mb-4">{weatherData.weather[0].description}</p>
                <div className="text-lg text-white/80 flex justify-center gap-6">
                  <span>High: {Math.round(weatherData.main.temp_max)}°</span>
                  <span>Low: {Math.round(weatherData.main.temp_min)}°</span>
                </div>
              </div>
              
              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailBox icon={<Thermometer className="w-8 h-8 text-red-300" />} label="Feels Like" value={`${Math.round(weatherData.main.feels_like)}°C`} />
                <DetailBox icon={<Droplets className="w-8 h-8 text-blue-300" />} label="Humidity" value={`${weatherData.main.humidity}%`} />
                <DetailBox icon={<Wind className="w-8 h-8 text-green-300" />} label={`Wind ${getWindDirection(weatherData.wind.deg)}`} value={`${Math.round(weatherData.wind.speed * 3.6)} km/h`} />
                <DetailBox icon={<Gauge className="w-8 h-8 text-orange-300" />} label="Pressure" value={`${weatherData.main.pressure} hPa`} />
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Sun Times */}
              <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-light mb-4 text-center">Sun Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sunrise className="w-6 h-6 text-yellow-300" />
                      <span>Sunrise</span>
                    </div>
                    <span className="font-light">{formatTime(weatherData.sys.sunrise)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sunset className="w-6 h-6 text-orange-300" />
                      <span>Sunset</span>
                    </div>
                    <span className="font-light">{formatTime(weatherData.sys.sunset)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-light mb-4 text-center">Details</h3>
                <div className="space-y-4 text-sm">
                  {weatherData.visibility && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-300" />
                        <span>Visibility</span>
                      </div>
                      <span>{(weatherData.visibility / 1000).toFixed(1)} km</span>
                    </div>
                  )}
                  {weatherData.wind.gust && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wind className="w-5 h-5 text-blue-200" />
                        <span>Wind Gust</span>
                      </div>
                      <span>{Math.round(weatherData.wind.gust * 3.6)} km/h</span>
                    </div>
                  )}
                  {weatherData.main.sea_level && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gauge className="w-5 h-5 text-cyan-300" />
                        <span>Sea Level</span>
                      </div>
                      <span>{weatherData.main.sea_level} hPa</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-white/70" />
                      <span>Updated</span>
                    </div>
                    <span>{formatTime(weatherData.dt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Default State */}
        {!weatherData && !error && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-16 text-white backdrop-blur-md bg-black/20 border border-white/20 rounded-3xl p-12 shadow-xl max-w-md">
              <Cloud className="w-24 h-24 mx-auto mb-6 animate-pulse opacity-70" />
              <p className="text-2xl mb-4 font-light">Discover Weather</p>
              <p className="text-white/70">Enter any city name to view beautiful, detailed weather information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced DetailBox component
const DetailBox = ({ icon, label, value }) => (
  <div className="backdrop-blur-md bg-black/20 border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 hover:bg-black/30 transition-all duration-300">
    <div className="flex justify-center mb-3">{icon}</div>
    <p className="text-center text-xl font-light text-white mb-1">{value}</p>
    <p className="text-center text-white/70 text-sm">{label}</p>
  </div>
);

export default WeatherApp;