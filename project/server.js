import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let cities = [];
let notifications = [];
let historicalData = new Map(); // cityId -> YearlyWeatherData[]

// Weather conditions for dummy data
const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Foggy', 'Partly Cloudy'];

// Helper function to generate historical weather data for a city
function generateHistoricalData(cityId, cityName) {
  const years = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = currentYear - 9; year <= currentYear; year++) {
    const yearData = [];
    let totalTemp = 0;
    const conditionCount = {};
    
    // Generate 12 data points per year (monthly averages)
    for (let month = 0; month < 12; month++) {
      const temperature = Math.floor(Math.random() * 35) + 5; // 5-40°C
      const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const humidity = Math.floor(Math.random() * 60) + 30; // 30-90%
      const windSpeed = Math.floor(Math.random() * 25) + 5; // 5-30 km/h
      
      const date = new Date(year, month, 15).toISOString(); // 15th of each month
      
      yearData.push({
        date,
        temperature,
        condition,
        humidity,
        windSpeed
      });
      
      totalTemp += temperature;
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    }
    
    // Calculate averages and most common condition
    const averageTemperature = Math.round(totalTemp / 12);
    const mostCommonCondition = Object.keys(conditionCount).reduce((a, b) => 
      conditionCount[a] > conditionCount[b] ? a : b
    );
    
    years.push({
      year,
      data: yearData,
      averageTemperature,
      mostCommonCondition
    });
  }
  
  historicalData.set(cityId, years);
  return years;
}

// Helper function to generate dummy weather data
function generateWeatherData(cityName) {
  const temperature = Math.floor(Math.random() * 40) + 5; // 5-45°C
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: cityName,
    temperature,
    condition,
    lastUpdated: new Date().toISOString(),
    country: 'Unknown' // In a real app, this would come from the weather API
  };
}

// API Routes

// GET /cities - Get all tracked cities
app.get('/api/cities', (req, res) => {
  try {
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities'
    });
  }
});

// POST /city - Add a new city
app.post('/api/city', (req, res) => {
  try {
    const { cityName } = req.body;
    
    if (!cityName || cityName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'City name is required'
      });
    }

    // Check if city already exists
    const existingCity = cities.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (existingCity) {
      return res.status(409).json({
        success: false,
        error: 'City is already being tracked'
      });
    }

    // Generate weather data for the new city
    const newCity = generateWeatherData(cityName);
    cities.push(newCity);
    
    // Generate historical data for the new city
    generateHistoricalData(newCity.id, newCity.name);

    // Log the addition
    console.log(`Added new city: ${cityName} - ${newCity.temperature}°C, ${newCity.condition}`);

    res.status(201).json({
      success: true,
      data: newCity
    });
  } catch (error) {
    console.error('Error adding city:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add city'
    });
  }
});

// DELETE /city/:id - Remove a city
app.delete('/api/city/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cityIndex = cities.findIndex(city => city.id === id);
    
    if (cityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }

    const deletedCity = cities.splice(cityIndex, 1)[0];
    console.log(`Deleted city: ${deletedCity.name}`);

    res.json({
      success: true,
      data: { message: `${deletedCity.name} removed from tracking` }
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete city'
    });
  }
});

// POST /refresh/:id - Refresh weather for a specific city
app.post('/api/refresh/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cityIndex = cities.findIndex(city => city.id === id);
    
    if (cityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }

    // Update weather data
    const updatedWeather = generateWeatherData(cities[cityIndex].name);
    cities[cityIndex] = { ...cities[cityIndex], ...updatedWeather, id: cities[cityIndex].id };

    console.log(`Refreshed weather for ${cities[cityIndex].name}: ${cities[cityIndex].temperature}°C, ${cities[cityIndex].condition}`);

    res.json({
      success: true,
      data: cities[cityIndex]
    });
  } catch (error) {
    console.error('Error refreshing weather:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh weather data'
    });
  }
});

// POST /refresh-all - Refresh weather for all cities
app.post('/api/refresh-all', (req, res) => {
  try {
    cities = cities.map(city => {
      const updatedWeather = generateWeatherData(city.name);
      return { ...city, ...updatedWeather, id: city.id };
    });

    console.log(`Refreshed weather for ${cities.length} cities`);

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error refreshing all weather data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh weather data'
    });
  }
});

// POST /notify - Telegram bot integration endpoint
app.post('/api/notify', (req, res) => {
  try {
    const { cityName, message, temperature, condition } = req.body;
    
    if (!cityName || !message) {
      return res.status(400).json({
        success: false,
        error: 'City name and message are required'
      });
    }

    const notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      cityName,
      message,
      timestamp: new Date().toISOString(),
      temperature: temperature || 0,
      condition: condition || 'Unknown'
    };

    notifications.unshift(notification); // Add to beginning of array
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50);
    }

    // Log the notification
    console.log(`Weather alert for ${cityName}: ${message}`);

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process notification'
    });
  }
});

// GET /notifications - Get all notifications
app.get('/api/notifications', (req, res) => {
  try {
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// GET /historical/:id - Get historical weather data for a city
app.get('/api/historical/:id', (req, res) => {
  try {
    const { id } = req.params;
    const city = cities.find(city => city.id === id);
    
    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }

    let cityHistoricalData = historicalData.get(id);
    
    // Generate historical data if it doesn't exist
    if (!cityHistoricalData) {
      cityHistoricalData = generateHistoricalData(id, city.name);
    }

    console.log(`Retrieved historical data for ${city.name}: ${cityHistoricalData.length} years`);

    res.json({
      success: true,
      data: cityHistoricalData
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      citiesTracked: cities.length,
      notificationsCount: notifications.length
    }
  });
});

// Initialize with some sample data
function initializeSampleData() {
  const sampleCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'];
  sampleCities.forEach(cityName => {
    const city = generateWeatherData(cityName);
    cities.push(city);
    // Generate historical data for each sample city
    generateHistoricalData(city.id, city.name);
  });
  
  // Add sample notifications
  notifications.push({
    id: '1',
    cityName: 'London',
    message: 'Weather alert: Heavy rain expected',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    temperature: 18,
    condition: 'Rainy'
  });
  
  console.log(`Initialized with ${cities.length} sample cities`);
}

// Initialize sample data
initializeSampleData();

app.listen(PORT, () => {
  console.log(`Weather Admin Panel API server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});