'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'bolajabena') {
      setIsAuthenticated(true);
      fetchExpenses();
      fetchRegistrations();
    } else {
      alert('Invalid password');
    }
  };

  const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    setExpenses(data);
  };

  const fetchRegistrations = async () => {
    const response = await fetch('/api/tour-registration');
    const data = await response.json();
    setRegistrations(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        amount: parseFloat(amount),
      }),
    });

    if (response.ok) {
      setDescription('');
      setAmount('');
      fetchExpenses();
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const response = await fetch(`/api/tour-registration/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      fetchRegistrations();
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      APPROVED: "bg-green-100 text-green-800 hover:bg-green-200",
      REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
    };
    
    const labels = {
      PENDING: "পেন্ডিং",
      APPROVED: "অনুমোদিত",
      REJECTED: "বাতিল",
    };

    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>অ্যাডমিন লগইন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                />
              </div>
              <Button type="submit" className="w-full">লগইন</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">খরচ</TabsTrigger>
            <TabsTrigger value="registrations">ট্যুর রেজিস্ট্রেশন</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>নতুন খরচ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">বিবরণ</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="খরচের বিবরণ লিখুন"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">পরিমাণ</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="টাকার পরিমাণ"
                      required
                    />
                  </div>
                  <Button type="submit">যোগ করুন</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>সাম্প্রতিক খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold">${expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>ট্যুর রেজিস্ট্রেশন তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">{reg.name}</p>
                          <p className="text-sm text-gray-500">{reg.phone}</p>
                          <p className="text-sm text-gray-500">{reg.address}</p>
                          <p className="text-sm">লোক সংখ্যা: {reg.persons}</p>
                          <p className="text-sm">তারিখ: {new Date(reg.date).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-2">
                          {getStatusBadge(reg.status)}
                          {reg.status === 'PENDING' && (
                            <div className="space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-100 text-green-800 hover:bg-green-200"
                                onClick={() => handleStatusUpdate(reg.id, 'APPROVED')}
                              >
                                অনুমোদন
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-100 text-red-800 hover:bg-red-200"
                                onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                              >
                                বাতিল
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Button variant="outline" onClick={() => router.push('/')}>
            হোমপেজে ফিরে যান
          </Button>
        </div>
      </div>
    </div>
  );
} 