// /pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import WeatherCard from '../components/WeatherCard';

export default function Dashboard() {
  const { isAuthenticated, loading, user, logout, getAccessToken } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const API_URL = 'https://api.cloud-it.com.ar';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeatherData();
    }
  }, [isAuthenticated]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/api/weather`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del clima');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al obtener los datos del clima');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard del Clima</h1>
          <div className="flex items-center">
            {user && (
              <div className="mr-4 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="font-medium">Hola, </span>
                <span className="font-bold">{user.preferred_username || user.name}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="btn btn-danger"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <WeatherCard 
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
          onRetry={fetchWeatherData}
        />
        
        <div className="mt-8 card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Información del Sistema</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Componentes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Frontend: Next.js</li>
                  <li>Backend: FastAPI</li>
                  <li>Autenticación: Keycloak</li>
                  <li>Gateway API: APISIX</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Estado de Servicios</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Backend API</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Keycloak</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>APISIX Gateway</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
