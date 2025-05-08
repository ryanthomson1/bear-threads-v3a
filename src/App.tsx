import React from 'react';
import GeneratePosts from './tabs/GeneratePosts';
import Replies from './tabs/Replies';
import ImageBrowser from './tabs/ImageBrowser';
import AppSettings from './tabs/AppSettings';
import { Card } from './components/ui/card';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('generate');

  return (
    <div className="min-h-screen bg-[#202123] text-[#dadada]">
      <header className="p-4 flex justify-between items-center border-b border-[#373940]">
        <h1 className="text-xl font-bold">Bear Threads Generator</h1>
        <nav className="space-x-4">
          <button onClick={() => setActiveTab('generate')}>Generate</button>
          <button onClick={() => setActiveTab('replies')}>Replies</button>
          <button onClick={() => setActiveTab('images')}>Images</button>
          <button onClick={() => setActiveTab('settings')}>Settings</button>
        </nav>
      </header>
      <main className="container grid grid-cols-12 gap-4 p-6">
        <Card className="col-span-12 p-4">
          {activeTab === 'generate' && <GeneratePosts />}
          {activeTab === 'replies' && <Replies />}
          {activeTab === 'images' && <ImageBrowser />}
          {activeTab === 'settings' && <AppSettings />}
        </Card>
      </main>
      <footer className="p-4 text-center text-sm text-[#8a8a8a] border-t border-[#373940]">
        © 2023 Bear Threads Generator. All rights reserved.
      </footer>
    </div>
  );
}
