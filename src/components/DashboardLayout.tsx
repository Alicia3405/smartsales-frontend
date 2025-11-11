'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../services/authService';
import { WebSocketService } from '../services/websocketService';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const wsService = new WebSocketService();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Connect to WebSocket
    wsService.connect();

    return () => {
      wsService.disconnect();
    };
  }, [router]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-white">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
