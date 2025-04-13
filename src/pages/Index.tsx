
import React from 'react';
import { Playground } from '@/components/Playground';

const Index: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="p-4 bg-background z-10 border-b">
        <h1 className="text-2xl font-semibold text-center">Bouncing Shapes Playground</h1>
      </header>
      <main className="flex-1 relative">
        <Playground />
      </main>
    </div>
  );
};

export default Index;
