'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, AlertCircle } from "lucide-react";

export default function Schedule() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'ONGOING':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'আসন্ন';
      case 'ONGOING':
        return 'চলমান';
      case 'COMPLETED':
        return 'সম্পন্ন';
      default:
        return 'বাতিল';
    }
  };

  const getTimeRemaining = (activityTime) => {
    const now = new Date();
    const time = new Date(activityTime);
    const diff = time - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let remaining = '';
    if (days > 0) remaining += `${days} দিন `;
    if (hours > 0) remaining += `${hours} ঘন্টা `;
    if (minutes > 0) remaining += `${minutes} মিনিট`;

    return remaining.trim() || 'কয়েক মুহূর্ত';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const upcomingActivities = activities.filter(
    activity => activity.status === 'UPCOMING' || activity.status === 'ONGOING'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          আমাদের পরবর্তী কার্যক্রম
        </h1>
        
        <div className="grid gap-6">
          {upcomingActivities.map((activity) => {
            const timeRemaining = getTimeRemaining(activity.time);
            
            return (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-semibold">{activity.title}</h2>
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusText(activity.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600">{activity.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{formatDate(activity.time)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.location}</span>
                        </div>
                      </div>

                      {activity.status === 'UPCOMING' && timeRemaining && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>বাকি আছে: {timeRemaining}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {upcomingActivities.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">এই মুহূর্তে কোন আসন্ন কার্যক্রম নেই</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 