'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pokemon, PokemonStat } from '../types/pokemon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

interface PokemonSpecies {
  name: string;
  genus: string;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
  }>;
  habitat: {
    name: string;
  } | null;
  generation: {
    name: string;
  };
  growth_rate: {
    name: string;
  };
  capture_rate: number;
  base_happiness: number;
  evolution_chain: {
    url: string;
  };
}

interface EvolutionChain {
  chain: EvolutionChainLink;
}

interface EvolutionChainLink {
  species: {
    name: string;
  };
  evolves_to: EvolutionChainLink[];
  evolution_details?: Array<{
    min_level?: number;
    trigger: {
      name: string;
    };
  }>;
}

interface PokemonMove {
  move: {
    name: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }>;
}

export default function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [evolutionData, setEvolutionData] = useState<EvolutionChain | null>(null);
  const [movesData, setMovesData] = useState<PokemonMove[]>([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [loadingEvolution, setLoadingEvolution] = useState(false);
  const [loadingMoves, setLoadingMoves] = useState(false);

  // Define all the data fetching functions first using useCallback
  const fetchSpeciesData = useCallback(async () => {
    if (!pokemon) return;

    try {
      setLoadingSpecies(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSpeciesData(data);
    } catch (error: unknown) {
      // Handle error state
      setSpeciesData(null);
      // In a production app, you might want to show a toast notification here
      // or use a proper error boundary
      if (error instanceof Error) {
        console.error('Error fetching species data:', error.message);
      }
    } finally {
      setLoadingSpecies(false);
    }
  }, [pokemon]);

  const fetchEvolutionData = useCallback(async () => {
    if (!pokemon) return;

    try {
      setLoadingEvolution(true);
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      if (!speciesResponse.ok) {
        throw new Error(`HTTP error! status: ${speciesResponse.status}`);
      }
      const speciesData = await speciesResponse.json();

      if (speciesData.evolution_chain?.url) {
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        if (!evolutionResponse.ok) {
          throw new Error(`HTTP error! status: ${evolutionResponse.status}`);
        }
        const evolutionData = await evolutionResponse.json();
        setEvolutionData(evolutionData);
      }
    } catch (error: unknown) {
      // Handle error state
      setEvolutionData(null);
      // In a production app, you might want to show a toast notification here
      // or use a proper error boundary
      if (error instanceof Error) {
        console.error('Error fetching evolution data:', error.message);
      }
    } finally {
      setLoadingEvolution(false);
    }
  }, [pokemon]);

  const fetchMovesData = useCallback(async () => {
    if (!pokemon) return;

    try {
      setLoadingMoves(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovesData(data.moves || []);
    } catch (error: unknown) {
      // Handle error state
      setMovesData([]);
      // In a production app, you might want to show a toast notification here
      // or use a proper error boundary
      if (error instanceof Error) {
        console.error('Error fetching moves data:', error.message);
      }
    } finally {
      setLoadingMoves(false);
    }
  }, [pokemon]);

  // Add the useEffect hook after all the functions it depends on are defined
  useEffect(() => {
    if (pokemon) {
      fetchSpeciesData();
      fetchEvolutionData();
      fetchMovesData();
    }
  }, [pokemon, fetchSpeciesData, fetchEvolutionData, fetchMovesData]);

  if (!pokemon) return null;

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'fire': return 'from-red-400 to-orange-500';
      case 'water': return 'from-blue-400 to-cyan-500';
      case 'grass': return 'from-green-400 to-teal-500';
      case 'electric': return 'from-yellow-400 to-amber-500';
      case 'ice': return 'from-cyan-400 to-blue-500';
      case 'fighting': return 'from-orange-400 to-red-500';
      case 'poison': return 'from-purple-400 to-pink-500';
      case 'ground': return 'from-amber-400 to-yellow-500';
      case 'flying': return 'from-indigo-400 to-purple-500';
      case 'psychic': return 'from-pink-400 to-purple-500';
      case 'bug': return 'from-lime-400 to-green-500';
      case 'rock': return 'from-stone-400 to-gray-500';
      case 'ghost': return 'from-violet-400 to-purple-500';
      case 'dragon': return 'from-indigo-400 to-purple-500';
      case 'dark': return 'from-gray-400 to-slate-500';
      case 'steel': return 'from-slate-400 to-gray-500';
      case 'fairy': return 'from-pink-400 to-rose-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  const renderEvolutionChain = (chain: EvolutionChainLink | null, level: number = 0) => {
    if (!chain) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
            {level + 1}
          </div>
          <span className="font-medium capitalize text-foreground">{chain.species.name}</span>
        </div>

        {chain.evolves_to && chain.evolves_to.length > 0 && (
          <div className="ml-4 space-y-2">
            {chain.evolves_to.map((evolution, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                    &rarr; {/* HTML entity escaping */}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {evolution.evolution_details?.[0]?.trigger.name.replace('-', ' ')} 
                    {evolution.evolution_details?.[0]?.min_level && ` (Level ${evolution.evolution_details?.[0].min_level})`}
                  </span>
                </div>
                {renderEvolutionChain(evolution, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!pokemon) return null;

  return (
    <Dialog open={!!pokemon} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Pokemon Details</DialogTitle>
        </DialogHeader>
        {/* Top Section with Pokemon Image and Info */}
        <div className={`relative bg-gradient-to-br ${getTypeBackground(pokemon.types[0])} p-6 pb-12`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full"></div>
          </div>

          {/* Pokemon Name and ID */}
          <div className="relative z-10 flex justify-between items-start text-white">
            <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            <p className="text-lg opacity-90">#{pokemon.id.toString().padStart(4, '0')}</p>
          </div>

          {/* Types */}
          <div className="relative z-10 flex gap-2 mt-3">
            {pokemon.types.map((type: string) => (
              <Badge
                key={type}
                className={`capitalize bg-white/20 text-white border-white/30 hover:bg-white/30 ${
                  type === 'grass' 
                    ? 'bg-green-500/30 border-green-400/50'
                    : type === 'poison'
                    ? 'bg-purple-500/30 border-purple-400/50'
                    : type === 'fire'
                    ? 'bg-red-500/30 border-red-400/50'
                    : type === 'water'
                    ? 'bg-blue-500/30 border-blue-400/50'
                    : type === 'electric'
                    ? 'bg-yellow-500/30 border-yellow-400/50'
                    : type === 'ice'
                    ? 'bg-cyan-500/30 border-cyan-400/50'
                    : type === 'fighting'
                    ? 'bg-orange-500/30 border-orange-400/50'
                    : type === 'ground'
                    ? 'bg-amber-500/30 border-amber-400/50'
                    : type === 'flying'
                    ? 'bg-indigo-500/30 border-indigo-400/50'
                    : type === 'psychic'
                    ? 'bg-pink-500/30 border-pink-400/50'
                    : type === 'bug'
                    ? 'bg-lime-500/30 border-lime-400/50'
                    : type === 'rock'
                    ? 'bg-stone-500/30 border-stone-400/50'
                    : type === 'ghost'
                    ? 'bg-violet-500/30 border-violet-400/50'
                    : type === 'dragon'
                    ? 'bg-indigo-500/30 border-indigo-400/50'
                    : type === 'dark'
                    ? 'bg-gray-500/30 border-gray-400/50'
                    : type === 'steel'
                    ? 'bg-slate-500/30 border-slate-400/50'
                    : type === 'fairy'
                    ? 'bg-pink-500/30 border-pink-400/50'
                    : 'bg-white/20 border-white/30'
                }`}
              >
                {type}
              </Badge>
            ))}
          </div>

          {/* Pokemon Image - Centered and overlapping */}
          <div className="relative z-10 flex justify-center mt-4">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={160}
              height={160}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Bottom Section with Tabs */}
        <div className="bg-background rounded-t-3xl -mt-8 relative z-20 min-h-[400px]">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent">
              <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">About</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Base Stats</TabsTrigger>
              <TabsTrigger value="evolution" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Evolution</TabsTrigger>
              <TabsTrigger value="moves" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Moves</TabsTrigger>
            </TabsList>

                      <TabsContent value="about" className="space-y-4 p-6">
              {/* Physical Characteristics */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Physical Characteristics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Species</span>
                    <span className="font-medium text-foreground capitalize">
                      {speciesData?.genus || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Height</span>
                    <span className="font-medium text-foreground">
                      {pokemon.height / 10}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Weight</span>
                    <span className="font-medium text-foreground">
                      {pokemon.weight / 10}kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Abilities</span>
                    <span className="font-medium text-foreground capitalize">
                      {pokemon.abilities.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Species Information */}
              {loadingSpecies ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : speciesData ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Species Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Generation</span>
                      <span className="font-medium text-foreground capitalize">
                        {speciesData.generation.name.replace('-', ' ')}
                      </span>
                    </div>
                    {speciesData.habitat && (
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Habitat</span>
                        <span className="font-medium text-foreground capitalize">
                          {speciesData.habitat.name.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className="font-medium text-foreground capitalize">
                        {speciesData.growth_rate.name.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Capture Rate</span>
                      <span className="font-medium text-foreground">
                        {speciesData.capture_rate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Base Happiness</span>
                      <span className="font-medium text-foreground">
                        {speciesData.base_happiness}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </TabsContent>

          <TabsContent value="stats" className="space-y-4 p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat: PokemonStat) => (
                <div key={stat.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="capitalize text-muted-foreground">
                      {stat.name.replace('-', ' ')}
                    </span>
                    <span className="font-medium text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((stat.value / 255) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4 p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Evolution Chain</h3>
            {loadingEvolution ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : evolutionData ? (
              <div className="space-y-4">
                {renderEvolutionChain(evolutionData.chain)}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">No evolution data available</p>
                  <p className="text-sm">This Pokemon doesn&apos;t have an evolution chain.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="moves" className="space-y-4 p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Moves</h3>
            {loadingMoves ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : movesData.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {movesData
                  .filter(move => 
                    move.version_group_details.some(detail => 
                      detail.move_learn_method.name === 'level-up'
                    )
                  )
                  .sort((a, b) => {
                    const aLevel = a.version_group_details.find(d => d.move_learn_method.name === 'level-up')?.level_learned_at || 0;
                    const bLevel = b.version_group_details.find(d => d.move_learn_method.name === 'level-up')?.level_learned_at || 0;
                    return aLevel - bLevel;
                  })
                  .map((move, index) => {
                    const levelUpDetail = move.version_group_details.find(d => d.move_learn_method.name === 'level-up');
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                        <span className="font-medium capitalize text-foreground">
                          {move.move.name.replace('-', ' ')}
                        </span>
                        {levelUpDetail && (
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
                            Level {levelUpDetail.level_learned_at}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">No moves data available</p>
                  <p className="text-sm">This Pokemon doesn&apos;t have any moves.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 