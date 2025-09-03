import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { CategoryStat } from '@/types';

interface CategoryStatsProps {
  stats: CategoryStat[];
}

const categoryIcons: Record<string, string> = {
  'salud': '🏥',
  'educacion': '📚',
  'empleo': '💼',
  'seguridad': '🛡️',
  'vivienda': '🏠',
  'servicios-publicos': '⚡',
  'medio-ambiente': '🌱',
  'movilidad': '🚌',
  'alimentacion': '🍽️',
  'cultura-deporte': '🎨',
};

export function CategoryStats({ stats }: CategoryStatsProps) {
  const maxCount = Math.max(...stats.map(s => s.count), 1);
  const totalResponses = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <Card className="bg-gradient-to-br from-card to-secondary-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Necesidades por Categoría
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {totalResponses} respuesta{totalResponses !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-muted-foreground">
              Aún no hay datos disponibles
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.filter(s => s.count > 0).map((stat, index) => (
              <div key={stat.slug} className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-white/50 to-transparent">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categoryIcons[stat.slug] || '📌'}
                    </span>
                    <span className="font-medium">{stat.name}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      index === 0 ? 'bg-primary text-primary-foreground' : 
                      index === 1 ? 'bg-secondary text-secondary-foreground' : 
                      'bg-muted'
                    }`}
                  >
                    {stat.count}
                  </Badge>
                </div>
                <Progress 
                  value={(stat.count / maxCount) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-muted-foreground">
                  {((stat.count / totalResponses) * 100).toFixed(1)}% del total
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}