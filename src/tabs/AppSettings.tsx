import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function AppSettings() {
  return (    
    <Card className="grid grid-cols-12 gap-4 p-4">      
      <CardHeader className="col-span-12">        
        <CardTitle>App Settings</CardTitle>
      </CardHeader>
    </Card>
  );
}