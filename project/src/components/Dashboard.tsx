import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Thermometer, Cloud, Sun, CloudRain, Zap, Snowflake, Eye } from 'lucide-react';
import { City } from '../types/weather';
import { weatherAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [refreshingCity, setRefreshingCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await weatherAPI.getCities();
      if (response.success && response.data) {
        setCities(response.data);
      } else {
        setError(response.error || 'Failed to fetch cities');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    setError(null);
    try {
      const response = await weatherAPI.refreshAllCities();
      if (response.success && response.data) {
        setCities(response.data);
      } else {
        setError(response.error || 'Failed to refresh weather data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setRefreshingAll(false);
    }
  };

  const handleRefreshCity = async (cityId: string) => {
    setRefreshingCity(cityId);
    setError(null);
    try {
      const response = await weatherAPI.refreshCity(cityId);
      if (response.success && response.data) {
        setCities(prev => 
          prev.map(city => 
            city.id === cityId ? response.data! : city
          )
        );
      } else {
        setError(response.error || 'Failed to refresh city weather');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setRefreshingCity(null);
    }
  };

  const handleDeleteCity = async (cityId: string, cityName: string) => {
    if (!window.confirm(`Are you sure you want to stop tracking ${cityName}?`)) {
      return;
    }

    setError(null);
    try {
      const response = await weatherAPI.deleteCity(cityId);
      if (response.success) {
        setCities(prev => prev.filter(city => city.id !== cityId));
      } else {
        setError(response.error || 'Failed to delete city');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    } else if (lowerCondition.includes('rain')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    } else if (lowerCondition.includes('storm')) {
      return <Zap className="w-5 h-5 text-purple-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <Snowflake className="w-5 h-5 text-blue-300" />;
    } else if (lowerCondition.includes('fog')) {
      return <Eye className="w-5 h-5 text-gray-400" />;
    } else {
      return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading cities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weather Dashboard</h2>
            <p className="text-gray-600 mt-1">Tracking {cities.length} cities</p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={refreshingAll}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshingAll ? 'animate-spin' : ''}`} />
            {refreshingAll ? 'Refreshing...' : 'Refresh All'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {cities.length === 0 ? (
          <div className="text-center py-12">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cities tracked</h3>
            <p className="text-gray-600">Add your first city to start tracking weather data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{city.name}</div>
                          {city.country && (
                            <div className="text-sm text-gray-500">{city.country}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{city.temperature}°C</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getWeatherIcon(city.condition)}
                        <span className="ml-2 text-sm text-gray-900">{city.condition}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastUpdated(city.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRefreshCity(city.id)}
                          disabled={refreshingCity === city.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 p-1 rounded"
                          title="Refresh weather data"
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshingCity === city.id ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city.id, city.name)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Remove city"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;