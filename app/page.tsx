'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-white text-2xl">Loading Dashboard...</div>
    </div>
  )
});

export default function Home() {
  return <Dashboard />;
}