'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users, Utensils, Hotel, Bus } from "lucide-react";

export default function TourDetails() {
  const tours = [
    {
      title: "কক্সবাজার ট্যুর প্যাকেজ",
      duration: "৩ দিন ২ রাত",
      price: "৮,৫০০ টাকা",
      spots: ["সমুদ্র সৈকত", "ইনানী বীচ", "হিমছড়ি", "লাবনী পয়েন্ট"],
      features: [
        { icon: <Hotel className="w-5 h-5" />, text: "৩ স্টার হোটেল" },
        { icon: <Bus className="w-5 h-5" />, text: "এসি বাস" },
        { icon: <Utensils className="w-5 h-5" />, text: "সকাল-দুপুর-রাতের খাবার" }
      ]
    },
    {
      title: "বান্দরবান ট্যুর প্যাকেজ",
      duration: "৩ দিন ২ রাত",
      price: "৭,৫০০ টাকা",
      spots: ["নীলাচল", "নীলগিরি", "চিম্বুক", "মেঘলা"],
      features: [
        { icon: <Hotel className="w-5 h-5" />, text: "রিসোর্ট" },
        { icon: <Bus className="w-5 h-5" />, text: "জীপ সার্ভিস" },
        { icon: <Utensils className="w-5 h-5" />, text: "সকাল-দুপুর-রাতের খাবার" }
      ]
    },
    {
      title: "সেন্ট মার্টিন ট্যুর প্যাকেজ",
      duration: "৩ দিন ২ রাত",
      price: "১২,০০০ টাকা",
      spots: ["সেন্ট মার্টিন দ্বীপ", "ছোট দ্বীপ", "কোরাল বীচ"],
      features: [
        { icon: <Hotel className="w-5 h-5" />, text: "কটেজ" },
        { icon: <Bus className="w-5 h-5" />, text: "শিপ টিকেট" },
        { icon: <Utensils className="w-5 h-5" />, text: "সকাল-দুপুর-রাতের খাবার" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ট্যুর বিবরণ
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-purple-800 mb-4">
                    {tour.title}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span>{tour.duration}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium mb-1">দর্শনীয় স্থান:</p>
                        <ul className="list-disc list-inside text-sm">
                          {tour.spots.map((spot, idx) => (
                            <li key={idx}>{spot}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">সুবিধাসমূহ:</p>
                      {tour.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-600">
                          {feature.icon}
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-lg font-semibold text-purple-800">
                        প্যাকেজ মূল্য: {tour.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        (প্রতি জন)
                      </p>
                    </div>
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