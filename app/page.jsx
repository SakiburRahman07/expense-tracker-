'use client';

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "বিখ্যাত স্পট সমূহ",
      description: "কক্সবাজার সমুদ্র সৈকত, বান্দরবান পাহাড়, নীলগিরি, নীলাচল এবং আরও অনেক কিছু"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "সুবিধাজনক সময়",
      description: "আপনার পছন্দের তারিখে ট্যুর প্ল্যান করুন"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "গ্রুপ ট্যুর",
      description: "১০-১৫ জনের গ্রুপের জন্য আকর্ষণীয় প্যাকেজ"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "৩ দিনের ট্যুর",
      description: "পরিপূর্ণ ৩ দিনের ট্যুর প্যাকেজ সকল খরচ সহ"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            আমাদের বৈশিষ্ট্য সমূহ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 