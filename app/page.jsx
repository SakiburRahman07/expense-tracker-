'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [totalExpenses, setTotalExpenses] = useState(0);

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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Link href="/admin">
            <Button>
              Go to Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 