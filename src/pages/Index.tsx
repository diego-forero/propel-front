import { useEffect, useState } from 'react';
import { SurveyForm } from '@/components/SurveyForm';
import { CategoryStats } from '@/components/CategoryStats';
import { ResponsesGrid } from '@/components/ResponsesGrid';
import { StatsCharts } from '@/components/StatsCharts';
import { LiveFeed } from '@/components/LiveFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/api';
import type { Category, Question, CategoryStat, ResponseRow } from '@/types';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [cats, qs, st, resp] = await Promise.all([
        api.getCategories(),
        api.getQuestions(),
        api.getCategoryStats(),
        api.getResponses(),
      ]);
      setCategories(cats);
      setQuestions(qs);
      setStats(st);
      setResponses(resp);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSuccess = async () => {
    const [st, resp] = await Promise.all([
      api.getCategoryStats(),
      api.getResponses(),
    ]);
    setStats(st);
    setResponses(resp);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-teal-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(20 95% 55% / 0.1) 0%, transparent 25%), 
                           radial-gradient(circle at 75% 75%, hsl(180 95% 35% / 0.1) 0%, transparent 25%)`
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header mejorado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🏘️</span>
            <span className="text-sm font-medium">Financiamiento para América Latina</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Mini Encuestas de la Comunidad
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre las mejores oportunidades de financiamiento para organizaciones sociales compartiendo las necesidades de tu comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Formulario principal */}
          <div className="xl:col-span-2">
            <SurveyForm 
              categories={categories} 
              questions={questions}
              onSuccess={handleFormSuccess}
            />
          </div>
          
          {/* Panel lateral */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
              <CategoryStats stats={stats} />
              <LiveFeed initialResponses={responses} />
            </div>
          </div>
        </div>

        {/* Sección de visualización de datos */}
        <div className="mt-16">
          <Tabs defaultValue="responses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="responses" className="flex items-center gap-2">
                💬 Respuestas
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                📊 Estadísticas
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                🔍 Análisis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="responses">
              <ResponsesGrid responses={responses} />
            </TabsContent>
            
            <TabsContent value="charts">
              <StatsCharts stats={stats} responses={responses} />
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-card to-orange-50/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🎯 Insights Clave
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                      <span>Categoría más mencionada</span>
                      <span className="font-medium">
                        {stats.length > 0 ? stats[0]?.name || 'N/A' : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                      <span>Total de participantes</span>
                      <span className="font-medium">{responses.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                      <span>Promedio respuestas/persona</span>
                      <span className="font-medium">
                        {responses.length > 0 ? (responses.length / new Set(responses.map(r => r.participant_email)).size).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
