import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Category, Question, ParticipantInput } from '@/types';
import { api } from '@/api';

interface SurveyFormProps {
  categories: Category[];
  questions: Question[];
  onSuccess: () => void;
}

const COUNTRIES = [
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'MX', name: 'México',   dial: '+52' },
  { code: 'AR', name: 'Argentina',dial: '+54' },
  { code: 'PE', name: 'Perú',     dial: '+51' },
  { code: 'CL', name: 'Chile',    dial: '+56' },
] as const;

export function SurveyForm({ categories, questions, onSuccess }: SurveyFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [participant, setParticipant] = useState<ParticipantInput>({
    name: '',
    email: '',
    age: undefined,
    country: '',
    city: '',
    neighborhood: '',
    phone: '',
  });

  const [countryCode, setCountryCode] = useState<string>('CO');
  const dial = useMemo(
    () => COUNTRIES.find(c => c.code === countryCode)?.dial ?? '+57',
    [countryCode]
  );
  const [phoneDigits, setPhoneDigits] = useState<string>('');

  useEffect(() => {
    if (participant.country) {
      const found = COUNTRIES.find(c => c.name.toLowerCase() === participant.country?.toLowerCase());
      if (found) setCountryCode(found.code);
    }
  }, []);

  useEffect(() => {
    const c = COUNTRIES.find(c => c.code === countryCode);
    if (c) {
      setParticipant(p => ({ ...p, country: c.name }));
    }
  }, [countryCode]);


  const handlePhoneDigitsChange = (val: string) => {
    const onlyDigits = val.replace(/\D/g, '');
    setPhoneDigits(onlyDigits);
  };

  const [q1Desc, setQ1Desc] = useState('');
  const [q1Cat, setQ1Cat] = useState<string>('');
  const [q2Desc, setQ2Desc] = useState('');

  const q1 = questions.find(q => q.id === 1)?.prompt ?? 'Pregunta 1';
  const q2 = questions.find(q => q.id === 2)?.prompt ?? 'Pregunta 2';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const phoneToSend = phoneDigits ? `${dial}${phoneDigits}` : undefined;

      await api.registerParticipant({
        ...participant,
        age: participant.age ? Number(participant.age) : undefined,
        phone: phoneToSend,
      });

      await api.createNeed({
        email: participant.email,
        questionId: 1,
        categorySlug: q1Cat || undefined,
        description: q1Desc,
      });

      if (q2Desc.trim()) {
        await api.createNeed({
          email: participant.email,
          questionId: 2,
          description: q2Desc,
        });
      }

      toast({
        title: "¡Gracias!",
        description: "Tu respuesta fue registrada exitosamente.",
      });

      setQ1Desc('');
      setQ1Cat('');
      setQ2Desc('');
      setPhoneDigits('');

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message ?? 'Error enviando formulario',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos de la persona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                required
                value={participant.name}
                onChange={e => setParticipant(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={participant.email}
                onChange={e => setParticipant(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                value={participant.age ?? ''}
                onChange={e => setParticipant(p => ({ ...p, age: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.dial})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={participant.city ?? ''}
                onChange={e => setParticipant(p => ({ ...p, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Barrio</Label>
              <Input
                id="neighborhood"
                value={participant.neighborhood ?? ''}
                onChange={e => setParticipant(p => ({ ...p, neighborhood: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="grid grid-cols-[auto,1fr] gap-2">
                <div className="min-w-[84px]">
                  <Input
                    value={dial}
                    readOnly
                    disabled
                    className="text-center font-medium"
                  />
                </div>
                <Input
                  id="phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Solo números"
                  value={phoneDigits}
                  onChange={e => handlePhoneDigitsChange(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Se enviará como: <code>{dial}{phoneDigits || '...'}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{q1}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="q1-desc">Describe la necesidad *</Label>
              <Textarea
                id="q1-desc"
                required
                rows={3}
                value={q1Desc}
                onChange={e => setQ1Desc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q1-cat">Categoría *</Label>
              <Select data-testid="q1-cat" value={q1Cat} onValueChange={setQ1Cat} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{q2}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="q2-desc">Tu propuesta</Label>
            <Textarea
              id="q2-desc"
              rows={3}
              value={q2Desc}
              onChange={e => setQ2Desc(e.target.value)}
              placeholder="Opcional pero recomendado"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Enviando...' : 'Enviar Respuesta'}
      </Button>
    </form>
  );
}