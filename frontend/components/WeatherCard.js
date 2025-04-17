// frontend/components/WeatherCard.js
import React from 'react';

const getWeatherIcon = (description) => {
  // Determina el ícono basado en la descripción del clima
  const desc = description.toLowerCase();
  if (desc.includes('clear') || desc.includes('sol')) return '☀️';
  if (desc.includes('cloud') || desc.includes('nube')) return '☁️';
  if (desc.includes('rain') || desc.includes('lluvia')) return '🌧️';
  if (desc.includes('snow') || desc.includes('nieve')) return '❄️';
  if (desc.includes('thunder') || desc.includes('tormenta')) return '⛈️';
  if (desc.includes('fog') || desc.includes('niebla')) return '🌫️';
  return '🌤️'; // Ícono por defecto
};

const WeatherCard = ({ weatherData, isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="card-header">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200">
        <div className="card-header bg-red-50 text-red-700 border-red-200">
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <div className="card-body text-red-600">
          <p className="mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="btn btn-primary bg-red-600 hover:bg-red-700"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="card">
        <div className="card-body">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const { location, temperature, description, humidity } = weatherData;
  const weatherIcon = getWeatherIcon(description);

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clima en {location}</h2>
        <span className="text-3xl">{weatherIcon}</span>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2 text-blue-700">Temperatura</h3>
            <p className="text-3xl font-bold">{temperature}°C</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2 text-blue-700">Descripción</h3>
            <p className="text-xl capitalize">{description}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-2 text-blue-700">Humedad</h3>
            <p className="text-3xl font-bold">{humidity}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
