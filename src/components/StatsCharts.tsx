import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { CategoryStat, ResponseRow } from '@/types';

interface StatsChartsProps {
  stats: CategoryStat[];
  responses: ResponseRow[];
}

const COLORS = [
  'hsl(20, 95%, 55%)',   // Orange
  'hsl(180, 95%, 35%)',  // Teal
  'hsl(20, 85%, 65%)',   // Light Orange
  'hsl(180, 85%, 45%)',  // Light Teal
  'hsl(40, 85%, 55%)',   // Yellow
  'hsl(160, 85%, 45%)',  // Green
  'hsl(300, 85%, 55%)',  // Purple
  'hsl(200, 85%, 55%)',  // Blue
  'hsl(340, 85%, 55%)',  // Pink
  'hsl(80, 85%, 55%)',   // Lime
];

export function StatsCharts({ stats, responses }: StatsChartsProps) {
  // Filtrar stats con datos para el gráfico
  const chartData = stats.filter(stat => stat.count > 0);

  // Análisis geográfico
  const locationData = responses.reduce((acc: Record<string, number>, response) => {
    // Extraer ubicación de los datos (necesitarías hacer join con participantes)
    // Por ahora simulamos con nombres de participantes
    const location = response.participant_name || 'Sin ubicación';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const locationChartData = Object.entries(locationData)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 8); // Top 8 ubicaciones

  return (
    <div className="space-y-6">
      {/* Gráfico de barras por categorías */}
      <Card className="bg-gradient-to-br from-card to-orange-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Necesidades por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="url(#categoryGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(20, 95%, 55%)" />
                    <stop offset="100%" stopColor="hsl(20, 85%, 65%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Aún no hay datos para mostrar
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico circular de distribución */}
      <Card className="bg-gradient-to-br from-card to-teal-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🥧 Distribución de Respuestas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Aún no hay datos para mostrar
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}