'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Correct import

export default function Home() {
  const router = useRouter(); // Correct usage

  return (
    <div>
      <h1>Home page</h1>
      <button onClick={() => router.push('/login')}>Go to Login</button>
    </div>
  );
}
