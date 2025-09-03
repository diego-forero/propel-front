// tests/SurveyForm.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Mock del toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

/**
 * Mock del Select de shadcn/ui:
 * - Reemplaza todo por un <select> nativo controlado
 * - Recolecta opciones buscando elementos cuyo tipo sea SelectItem (del mismo mock)
 * - Propaga children para no romper el árbol
 */
vi.mock('@/components/ui/select', () => {
  const React = require('react');

  // Definimos el componente "SelectItem" con nombre estable para reconocerlo
  function SelectItem(props: any) {
    return <div {...props} />;
  }

  function gatherOptionsFromChildren(nodes: any): Array<{ value: string; label: string }> {
    const list: Array<{ value: string; label: string }> = [];
    const visit = (node: any) => {
      React.Children.forEach(node, (child: any) => {
        if (!React.isValidElement(child)) return;
        // Si el tipo del elemento es nuestra función SelectItem (mockeada), lo tomamos como opción
        if (child.type === SelectItem && child.props?.value != null) {
          const label =
            typeof child.props.children === 'string'
              ? child.props.children
              : String(child.props.children);
          list.push({ value: String(child.props.value), label });
        }
        if (child.props?.children) visit(child.props.children);
      });
    };
    visit(nodes);
    return list;
  }

  function Select({ value, onValueChange, children, ...props }: any) {
    const items = gatherOptionsFromChildren(children);
    return (
      <>
        {/* renderizamos un <select> nativo para los tests */}
        <select
          data-testid={props['data-testid']}
          value={value ?? ''}
          onChange={(e) => onValueChange?.(e.target.value)}
        >
          <option value="" hidden />
          {items.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* mantenemos los children en el árbol por si algo los necesita */}
        <div style={{ display: 'none' }}>{children}</div>
      </>
    );
  }

  // Los demás componentes se renderizan como contenedores “no-op” que preservan children
  const passthrough = (p: any) => <div {...p}>{p.children}</div>;

  return {
    Select,
    SelectTrigger: passthrough,
    SelectContent: passthrough,
    SelectValue: (p: any) => <span {...p}>{p.children}</span>,
    SelectItem, // <- importante: mismo símbolo para poder reconocerlo arriba
  };
});

// Mock del API
vi.mock('@/api', () => ({
  api: {
    registerParticipant: vi.fn().mockResolvedValue({ id: 1 }),
    createNeed: vi.fn().mockResolvedValue({ id: 10 }),
  },
}));

import { api } from '@/api';
import { SurveyForm } from '@/components/SurveyForm';

const categories = [
  { id: 1, name: 'Salud', slug: 'salud' },
  { id: 2, name: 'Educación', slug: 'educacion' },
];

const questions = [
  { id: 1, prompt: '¿Cuál crees que es la mayor necesidad en tu comunidad?' },
  { id: 2, prompt: '¿Qué acción concreta propondrías para mejorar esa situación?' },
];

describe('SurveyForm', () => {
  it('submits with required fields and creates needs (categoría seleccionada)', async () => {
    const onSuccess = vi.fn();
    render(<SurveyForm categories={categories} questions={questions} onSuccess={onSuccess} />);

    const user = userEvent.setup();

    // Datos del participante
    await user.type(screen.getByLabelText(/Nombre/i), 'Diego');
    await user.type(screen.getByLabelText(/Email/i), 'diego@test.com');

    // Pregunta 1: descripción
    await user.type(screen.getByLabelText(/Describe la necesidad/i), 'No hay hospital');

    // Pregunta 1: categoría -> usamos el <select data-testid="q1-cat"> del mock
    const categorySelect = screen.getByTestId('q1-cat') as HTMLSelectElement;
    // Aseguramos que existan opciones (útil para depurar)
    // console.log(Array.from(categorySelect.options).map(o => ({ value: o.value, text: o.text })));

    await user.selectOptions(categorySelect, 'salud');

    // Enviar
    await user.click(screen.getByRole('button', { name: /Enviar Respuesta/i }));

    await waitFor(() => {
      expect(api.registerParticipant).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'diego@test.com' })
      );
      expect(api.createNeed).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'diego@test.com',
          questionId: 1,
          categorySlug: 'salud',
          description: 'No hay hospital',
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
