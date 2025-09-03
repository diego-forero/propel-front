import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ResponseRow } from '@/types';

interface ResponsesTableProps {
  responses: ResponseRow[];
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuestas recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aún no hay respuestas disponibles
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Persona</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map(response => (
                  <TableRow key={response.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(response.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {response.question}
                    </TableCell>
                    <TableCell>
                      {response.category_name ? (
                        <Badge variant="secondary">{response.category_name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={response.description}>
                        {response.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{response.participant_name}</div>
                        <div className="text-muted-foreground">{response.participant_email}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}