'use client';

import { useState } from 'react';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import { Pokemon } from './types/pokemon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './components/theme-toggle';

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Card className="flex-1 bg-transparent border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold">
                Pokemon Explorer
              </CardTitle>
              <CardDescription className="text-lg">
                Click on a Pokemon to see its details
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        <main>
          <PokemonList onPokemonSelect={handlePokemonSelect} />
        </main>

        {selectedPokemon && (
          <PokemonDetail
            pokemon={selectedPokemon}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  );
}
