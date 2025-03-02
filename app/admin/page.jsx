'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  DollarSign,
  Users,
  History,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'bolajabena') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid password');
    }
  };

  const fetchData = async () => {
    fetchExpenses();
    fetchRegistrations();
    fetchPendingTransactions();
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

  const fetchPendingTransactions = async () => {
    const response = await fetch('/api/transactions');
    const data = await response.json();
    setPendingTransactions(data);
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

  const handleTransactionApproval = async (transactionId, action) => {
    const response = await fetch('/api/transactions/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId, action }),
    });

    if (response.ok) {
      fetchData();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const sidebarItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: CreditCard },
    { id: 'expenses', label: 'খরচ', icon: DollarSign },
    { id: 'registrations', label: 'রেজিস্ট্রেশন', icon: Users },
    { id: 'transactions', label: 'লেনদেন', icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">মোট রেজিস্ট্রেশন</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{registrations.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">পেন্ডিং পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pendingTransactions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">মোট খরচ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
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

            <Card>
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
                          {formatDate(expense.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold">{formatCurrency(expense.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'registrations':
        return (
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
                        <p className="text-sm">তারিখ: {formatDate(reg.date)}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">মোট টাকা: {formatCurrency(reg.totalAmount)}</p>
                          <p className="text-sm font-medium">জমা: {formatCurrency(reg.paidAmount)}</p>
                          <p className="text-sm font-medium">বাকি: {formatCurrency(reg.dueAmount)}</p>
                        </div>
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
        );

      case 'transactions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>পেন্ডিং লেনদেন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">
                          {transaction.tourRegistration.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.tourRegistration.phone}
                        </p>
                        <p className="text-sm font-medium">
                          পরিমাণ: {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm">
                          পেমেন্ট মাধ্যম: {transaction.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-500">
                          তারিখ: {formatDate(transaction.paymentDate)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          অপেক্ষমান
                        </Badge>
                        <div className="space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                            onClick={() => handleTransactionApproval(transaction.id, 'APPROVED')}
                          >
                            অনুমোদন
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-100 text-red-800 hover:bg-red-200"
                            onClick={() => handleTransactionApproval(transaction.id, 'REJECTED')}
                          >
                            বাতিল
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingTransactions.length === 0 && (
                  <p className="text-center text-gray-500">কোন পেন্ডিং লেনদেন নেই</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">অ্যাডমিন প্যানেল</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="space-y-4 mt-8">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 w-full p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold">অ্যাডমিন প্যানেল</h1>
          </div>
          <div className="flex-1 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={() => router.push('/')}
            >
              <LogOut className="h-5 w-5 mr-2" />
              লগআউট
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 