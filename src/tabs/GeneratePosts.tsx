import React, { useState } from 'react';

export default function GeneratePosts() {
  const [prompt, setPrompt] = useState('');
  const [includeImages, setIncludeImages] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left side controls */}
      <div className="space-y-4">
        <textarea
          className="w-full bg-[#373940] text-[#dadada] border border-[#44444d] p-4 rounded-lg"
          rows={6}
          placeholder="Type your idea here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#8e8e93]">Include Images</label>
          <input
            type="checkbox"
            checked={includeImages}
            onChange={() => setIncludeImages(!includeImages)}
            className="accent-[#10a37f]"
          />
        </div>
        <button className="bg-[#10a37f] text-white py-2 px-4 rounded-lg hover:bg-[#0e8b6f]">
          Generate
        </button>
      </div>

      {/* Right side generated posts list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Generated Posts</h3>
        <div className="bg-[#373940] p-4 rounded-lg">[Post #1 goes here]</div>
        <div className="bg-[#373940] p-4 rounded-lg">[Post #2 goes here]</div>
        <div className="bg-[#373940] p-4 rounded-lg">[Post #3 goes here]</div>
      </div>
    </div>
  );
}