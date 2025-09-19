"use client";
import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Thermometer, Cloud, Wind, Droplets, TrendingUp, RefreshCw } from 'lucide-react';
import { City, YearlyWeatherData } from '../types/weather';
import { weatherAPI } from '../services/api';

const HistoricalData: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<YearlyWeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const response = await weatherAPI.getCities();
      if (response.success && response.data) {
        setCities(response.data);
        if (response.data.length > 0) {
          setSelectedCityId(response.data[0].id);
        }
      }
    } catch (err) {
      setError('Failed to fetch cities');
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchHistoricalData = async (cityId: string) => {
    if (!cityId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await weatherAPI.getHistoricalData(cityId);
      if (response.success && response.data) {
        setHistoricalData(response.data);
      } else {
        setError(response.error || 'Failed to fetch historical data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCityId) {
      fetchHistoricalData(selectedCityId);
    }
  }, [selectedCityId]);

  const selectedCity = cities.find(city => city.id === selectedCityId);
  const selectedYearData = historicalData.find(data => data.year === selectedYear);

  const getConditionIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>;
    } else if (lowerCondition.includes('rain')) {
      return <div className="w-3 h-3 bg-blue-400 rounded-full"></div>;
    } else if (lowerCondition.includes('storm')) {
      return <div className="w-3 h-3 bg-purple-400 rounded-full"></div>;
    } else if (lowerCondition.includes('snow')) {
      return <div className="w-3 h-3 bg-blue-200 rounded-full"></div>;
    } else {
      return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  if (citiesLoading) {
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
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Historical Weather Data</h2>
              <p className="text-gray-600 mt-1">View past 10 years of weather patterns</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="citySelect" className="text-sm font-medium text-gray-700">
            Select City:
          </label>
          <select
            id="citySelect"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a city...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {selectedCity && (
            <div className="flex items-center text-sm text-gray-600">
              <Thermometer className="w-4 h-4 mr-1" />
              Current: {selectedCity.temperature}°C, {selectedCity.condition}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading historical data...</span>
        </div>
      )}

      {/* Historical Data Display */}
      {!loading && selectedCityId && historicalData.length > 0 && (
        <>
          {/* Yearly Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">10-Year Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {historicalData.map((yearData) => (
                <div
                  key={yearData.year}
                  onClick={() => setSelectedYear(selectedYear === yearData.year ? null : yearData.year)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedYear === yearData.year
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{yearData.year}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Avg: {yearData.averageTemperature}°C
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      {getConditionIcon(yearData.mostCommonCondition)}
                      <span className="ml-2 text-xs text-gray-500">
                        {yearData.mostCommonCondition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Year View */}
          {selectedYear && selectedYearData && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedYear} Detailed Data - {selectedCity?.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Avg: {selectedYearData.averageTemperature}°C
                  </div>
                  <div className="flex items-center">
                    <Cloud className="w-4 h-4 mr-1" />
                    Most Common: {selectedYearData.mostCommonCondition}
                  </div>
                </div>
              </div>

              {/* Monthly Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedYearData.data.map((dayData, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(dayData.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {getConditionIcon(dayData.condition)}
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Thermometer className="w-3 h-3 mr-1" />
                          Temp
                        </span>
                        <span>{dayData.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Droplets className="w-3 h-3 mr-1" />
                          Humidity
                        </span>
                        <span>{dayData.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Wind className="w-3 h-3 mr-1" />
                          Wind
                        </span>
                        <span>{dayData.windSpeed} km/h</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {dayData.condition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* No Data State */}
      {!loading && selectedCityId && historicalData.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Historical Data Available</h3>
          <p className="text-gray-600">
            Historical weather data for {selectedCity?.name} is not available yet.
          </p>
        </div>
      )}

      {/* No Cities State */}
      {!citiesLoading && cities.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cities Available</h3>
          <p className="text-gray-600">
            Add some cities to the dashboard first to view their historical data.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoricalData;