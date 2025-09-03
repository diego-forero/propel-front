import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResponseRow } from '@/types';
import { api } from '@/api';

interface LiveFeedProps {
  initialResponses: ResponseRow[];
}

export function LiveFeed({ initialResponses }: LiveFeedProps) {
  const [responses, setResponses] = useState<ResponseRow[]>(initialResponses.slice(0, 5));
  const [newResponsesCount, setNewResponsesCount] = useState(0);
  const lastCountRef = useRef<number>(initialResponses.length);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const freshResponses = await api.getResponses();
        const total = freshResponses.length;
        const newCount = Math.max(0, total - lastCountRef.current);
        if (newCount > 0) {
          setResponses(freshResponses.slice(0, 5));
          setNewResponsesCount(newCount);
          
          // Reset counter after 3 seconds
          setTimeout(() => setNewResponsesCount(0), 3000);
        }
      } catch (error) {
        console.error('Error fetching live updates:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [initialResponses.length]);

  return (
    <Card className="bg-gradient-to-br from-card to-teal-50/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🔴 Feed en Vivo
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {responses.map((response, index) => (
            <div 
              key={response.id} 
              className={`p-3 rounded-lg border-l-4 ${
                index === 0 ? 'border-l-primary bg-primary/5' : 'border-l-muted bg-muted/20'
              } transition-all duration-500`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-foreground">
                  {response.participant_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(response.created_at).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {response.description}
              </p>
              
              {response.category_name && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {response.category_name}
                </Badge>
              )}
            </div>
          ))}
          
          {responses.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-2xl mb-2">⏳</div>
              <p>Esperando nuevas respuestas...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}