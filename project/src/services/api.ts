import { City, WeatherNotification, ApiResponse, YearlyWeatherData } from '../types/weather';

const API_BASE_URL = 'http://localhost:3000/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      error: 'Network error occurred'
    };
  }
}

export const weatherAPI = {
  // Get all cities
  getCities: (): Promise<ApiResponse<City[]>> => {
    return apiCall<City[]>('/cities');
  },

  // Add a new city
  addCity: (cityName: string): Promise<ApiResponse<City>> => {
    return apiCall<City>('/city', {
      method: 'POST',
      body: JSON.stringify({ cityName }),
    });
  },

  // Delete a city
  deleteCity: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>(`/city/${id}`, {
      method: 'DELETE',
    });
  },

  // Refresh weather for a specific city
  refreshCity: (id: string): Promise<ApiResponse<City>> => {
    return apiCall<City>(`/refresh/${id}`, {
      method: 'POST',
    });
  },

  // Refresh all cities
  refreshAllCities: (): Promise<ApiResponse<City[]>> => {
    return apiCall<City[]>('/refresh-all', {
      method: 'POST',
    });
  },

  // Get notifications
  getNotifications: (): Promise<ApiResponse<WeatherNotification[]>> => {
    return apiCall<WeatherNotification[]>('/notifications');
  },

  // Send notification (for Telegram bot integration)
  sendNotification: (notification: {
    cityName: string;
    message: string;
    temperature?: number;
    condition?: string;
  }): Promise<ApiResponse<WeatherNotification>> => {
    return apiCall<WeatherNotification>('/notify', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  },

  // Health check
  getHealth: (): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    citiesTracked: number;
    notificationsCount: number;
  }>> => {
    return apiCall('/health');
  },

  // Get historical weather data for a city
  getHistoricalData: (cityId: string): Promise<ApiResponse<YearlyWeatherData[]>> => {
    return apiCall<YearlyWeatherData[]>(`/historical/${cityId}`);
  },
};