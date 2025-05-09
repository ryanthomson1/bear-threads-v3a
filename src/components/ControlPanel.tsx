import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AdjustmentsHorizontalIcon, PlayIcon, StopIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'; // Corrected import path
import { Spinner } from './ui/spinner';

export default function ControlPanel() {
  // Mock state for loading, replace with actual loading state
  const isLoading = false;

  return (
    <Card className="p-4 grid grid-cols-12 gap-4">
      <section className="col-span-12">
        <h2>Control Panel</h2>
      </section>
      <div className="col-span-3 flex flex-col gap-2">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button variant="outline" aria-label="Settings"><AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" /> Settings</Button>
            <Button variant="default" aria-label="Start"><PlayIcon className="h-5 w-5 mr-2" /> Start</Button>
            <Button variant="outline" aria-label="Stop"><StopIcon className="h-5 w-5 mr-2" /> Stop</Button>
            <Button variant="outline" aria-label="Publish"><CloudArrowUpIcon className="h-5 w-5 mr-2" /> Publish</Button>
          </>
        )}
      </div>
    </Card>
  );
}