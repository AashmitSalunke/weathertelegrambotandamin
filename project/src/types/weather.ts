export interface City {
  id: string;
  name: string;
  temperature: number;
  condition: string;
  lastUpdated: string;
  country?: string;
}

export interface WeatherNotification {
  id: string;
  cityName: string;
  message: string;
  timestamp: string;
  temperature: number;
  condition: string;
}

export interface HistoricalWeatherData {
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface YearlyWeatherData {
  year: number;
  data: HistoricalWeatherData[];
  averageTemperature: number;
  mostCommonCondition: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}