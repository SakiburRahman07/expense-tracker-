'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import TourDetails from './components/TourDetails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    persons: '',
    date: new Date(),
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchTotalExpenses();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('expenses')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Expense' },
        () => {
          fetchTotalExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTotalExpenses = async () => {
    const response = await fetch('/api/expenses/total');
    const data = await response.json();
    setTotalExpenses(data.total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tour-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          phone: '',
          address: '',
          persons: '',
          date: new Date(),
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="mb-8 shadow-lg border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-800">মোট খরচ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center text-blue-900">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        <TourDetails />

        <Card className="shadow-lg border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-800">ট্যুর রেজিস্ট্রেশন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="আপনার নাম লিখুন"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নাম্বার</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="আপনার ফোন নাম্বার লিখুন"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="আপনার ঠিকানা লিখুন"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persons">লোক সংখ্যা</Label>
                <Input
                  id="persons"
                  type="number"
                  min="1"
                  value={formData.persons}
                  onChange={(e) => setFormData({ ...formData, persons: e.target.value })}
                  placeholder="কতজন যাবেন?"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label>তারিখ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-200 hover:border-green-500",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "তারিখ নির্বাচন করুন"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                রেজিস্ট্রেশন করুন
              </Button>

              {showSuccess && (
                <div className="p-4 bg-green-100 text-green-700 rounded-md text-center">
                  আপনার রেজিস্ট্রেশন সফল হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Link href="/admin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              অ্যাডমিন প্যানেল
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 