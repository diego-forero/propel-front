import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ResponseRow } from '@/types';

interface ResponsesGridProps {
  responses: ResponseRow[];
}

export function ResponsesGrid({ responses }: ResponsesGridProps) {
  const [filter, setFilter] = useState<'all' | '1' | '2'>('all');

  const question1Responses = responses.filter(r => r.question.includes('mayor necesidad'));
  const question2Responses = responses.filter(r => r.question.includes('acción concreta'));

  const getFilteredResponses = () => {
    switch (filter) {
      case '1': return question1Responses;
      case '2': return question2Responses;
      default: return responses;
    }
  };

  const ResponseCard = ({ response }: { response: ResponseRow }) => (
    <Card className="bg-gradient-to-br from-card to-orange-50/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
            <span className="text-sm text-muted-foreground">
              {new Date(response.created_at).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          {response.category_name && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10">
              {response.category_name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-4 leading-relaxed">"{response.description}"</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium text-foreground">{response.participant_name}</p>
            <p className="text-muted-foreground">{response.participant_email}</p>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {response.question.includes('mayor necesidad') ? 'Necesidad' : 'Propuesta'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💬 Respuestas de la Comunidad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas ({responses.length})</TabsTrigger>
            <TabsTrigger value="1">Necesidades ({question1Responses.length})</TabsTrigger>
            <TabsTrigger value="2">Propuestas ({question2Responses.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {getFilteredResponses().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-lg text-muted-foreground mb-2">
              Aún no hay respuestas para mostrar
            </p>
            <p className="text-sm text-muted-foreground">
              ¡Sé el primero en compartir las necesidades de tu comunidad!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredResponses().slice(0, 12).map(response => (
              <ResponseCard key={response.id} response={response} />
            ))}
          </div>
        )}

        {getFilteredResponses().length > 12 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              Ver más respuestas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}