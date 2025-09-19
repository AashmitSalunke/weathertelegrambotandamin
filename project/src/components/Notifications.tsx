import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Clock, Thermometer, RefreshCw } from 'lucide-react';
import { WeatherNotification } from '../types/weather';
import { weatherAPI } from '../services/api';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<WeatherNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await weatherAPI.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Demo function to add a sample notification
  const addSampleNotification = async () => {
    const sampleNotifications = [
      {
        cityName: 'London',
        message: 'Weather alert: Heavy rain expected in the next 2 hours',
        temperature: 18,
        condition: 'Rainy'
      },
      {
        cityName: 'Tokyo',
        message: 'Temperature alert: Extreme heat warning issued',
        temperature: 38,
        condition: 'Sunny'
      },
      {
        cityName: 'New York',
        message: 'Storm warning: Thunderstorm approaching',
        temperature: 24,
        condition: 'Stormy'
      }
    ];

    const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    
    try {
      const response = await weatherAPI.sendNotification(randomNotification);
      if (response.success) {
        // Refresh notifications to show the new one
        fetchNotifications();
      }
    } catch (err) {
      setError('Failed to send notification');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Weather Notifications</h2>
              <p className="text-gray-600 mt-1">
                Alerts and updates from the Telegram bot integration
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addSampleNotification}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Add Sample
            </button>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <div className="text-gray-600 space-y-2">
              <p>Weather alerts from the Telegram bot will appear here.</p>
              <p className="text-sm">Try adding a sample notification to see how it works!</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {notification.cityName}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {notification.temperature > 0 && (
                        <div className="flex items-center">
                          <Thermometer className="w-4 h-4 mr-1" />
                          {notification.temperature}°C
                        </div>
                      )}
                      {notification.condition && notification.condition !== 'Unknown' && (
                        <div className="px-2 py-1 bg-gray-100 rounded-md">
                          {notification.condition}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Bell className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Telegram Bot Integration</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>This endpoint receives weather alerts from your Telegram bot:</p>
              <code className="block bg-blue-100 p-2 rounded text-xs font-mono">
                POST http://localhost:3001/api/notify
              </code>
              <p>Expected payload format:</p>
              <pre className="bg-blue-100 p-2 rounded text-xs font-mono">
{`{
  "cityName": "London",
  "message": "Weather alert message",
  "temperature": 25,
  "condition": "Rainy"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;