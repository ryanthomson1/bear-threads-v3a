import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';

export default function ImageBrowser() {
  return (
    <Card as="section" className="col-span-12 md:col-span-6 lg:col-span-4 p-4 grid gap-4">
      <CardHeader>
        <CardTitle as="h2">Image Browser</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {/* Image content will go here */}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}