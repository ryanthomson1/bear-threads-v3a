import React from 'react';
import { Card } from './ui/card';
import { tagTypes } from '../lib/models';

interface TagProps {
  type: keyof typeof tagTypes;
}

function Tag({ type }: TagProps): JSX.Element {
  const tag = tagTypes[type];
  const Icon = tag.Icon;

  return (
    <div className={`flex items-center px-2 py-1 rounded-full text-white text-xs font-semibold bg-${tag.color}-500`}>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {tag.label}
    </div>
  );
}

interface PostCardProps {
  text: string;
  imageUrl?: string;
  tags?: (keyof typeof tagTypes)[];
}
export function PostCard({ text, imageUrl, tags }: PostCardProps): JSX.Element {
  // As a mock for fading older items, applying opacity 0.5
  return (
    <Card className="p-4 grid gap-4">
      <p>{text}</p>
      {imageUrl && <img src={imageUrl} alt="Post Image" className="w-full rounded-md" />}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tagType) => (
            <Tag key={tagType} type={tagType} />
          ))}
        </div>
      )}
    </Card>
  );
}
