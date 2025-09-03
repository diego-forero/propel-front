import { render, screen } from '@testing-library/react';
import { CategoryStats } from '@/components/CategoryStats';
import { describe, expect, it } from 'vitest';

describe('CategoryStats', () => {
  it('renders category names and counts', () => {
    const stats = [
      { name: 'Salud', slug: 'salud', count: 3 },
      { name: 'Educación', slug: 'educacion', count: 1 },
    ];

    render(<CategoryStats stats={stats} />);

    expect(screen.getByText(/Salud/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Educación/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});