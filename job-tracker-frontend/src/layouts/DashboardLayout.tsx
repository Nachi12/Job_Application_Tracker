import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CommandPalette from '../components/CommandPalette';
import JobFormModal from '../components/JobFormModal';
import { useJobsContext } from '../context/JobsContext';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { create } = useJobsContext();

  const handleCreateJob = async (data: any) => {
    await create(data);
    setAddModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-chalk text-haiti-900 dark:bg-haiti-950 dark:text-haiti-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenAddJob={() => setAddModalOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenAddJob={() => setAddModalOpen(true)}
      />

      {/* Global Add Application Modal */}
      <JobFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}