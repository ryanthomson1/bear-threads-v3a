import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImageGallery() {
  return (
    <Card className="col-span-12">
 <CardHeader>
 <CardTitle asChild><h2>Image Gallery</h2></CardTitle>
 </CardHeader>
 <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {/* Image Gallery Content */}
 </CardContent>
 </Card>
 );
}
      {/* Image Gallery Content */}
    </div>
  );
}