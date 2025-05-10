import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function AppSettings() {
  const [imageService, setImageService] = useState('leonardo-ai');

  useEffect(() => {
    const storedService = localStorage.getItem('imageService');
    if (storedService) {
      setImageService(storedService);
    }
  }, []);

  const handleServiceChange = (value: string) => {
    setImageService(value);
    localStorage.setItem('imageService', value);
  };

  return (    
    <Card className="grid grid-cols-12 gap-4 p-4">
      <CardHeader className="col-span-12">
        <CardTitle>App Settings</CardTitle>
      </CardHeader>
      <CardContent className="col-span-12">
        <div className="flex flex-col gap-4">
          <label htmlFor="image-service-select">Image Generation Service:</label>
          <Select value={imageService} onValueChange={handleServiceChange}>
            <SelectTrigger id="image-service-select" className="w-[180px]">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dalle-3">DALL-E 3</SelectItem>
              <SelectItem value="leonardo-ai">Leonardo.ai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}