import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          
          {/* Notion-style container */}
          <div className="mx-auto w-full max-w-6xl space-y-6">
            
            {/* Page Content */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <Outlet />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}