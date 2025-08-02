'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Zap, Flame, Droplets, Leaf, Shield } from 'lucide-react';

interface PokemonListProps {
  onPokemonSelect: (pokemon: Pokemon) => void;
}

export default function PokemonList({ onPokemonSelect }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        
        // Fetch detailed data for each Pokemon
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const detailResponse = await fetch(pokemon.url);
            const detailData = await detailResponse.json();
            return {
              id: detailData.id,
              name: detailData.name,
              image: detailData.sprites.front_default,
              types: detailData.types.map((type: any) => type.type.name),
              height: detailData.height,
              weight: detailData.weight,
              abilities: detailData.abilities.map((ability: any) => ability.ability.name),
              stats: detailData.stats.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat
              }))
            };
          })
        );
        
        setPokemonList(detailedPokemon);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        console.error('Error fetching Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire': return <Flame className="w-3 h-3" />;
      case 'water': return <Droplets className="w-3 h-3" />;
      case 'grass': return <Leaf className="w-3 h-3" />;
      case 'electric': return <Zap className="w-3 h-3" />;
      case 'psychic': return <Sparkles className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'fire': return 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800';
      case 'water': return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800';
      case 'grass': return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800';
      case 'electric': return 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800';
      case 'ice': return 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800';
      case 'fighting': return 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800';
      case 'poison': return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800';
      case 'ground': return 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800';
      case 'flying': return 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800';
      case 'psychic': return 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800';
      case 'bug': return 'bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-950/20 dark:to-green-950/20 border-lime-200 dark:border-lime-800';
      case 'rock': return 'bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-950/20 dark:to-gray-950/20 border-stone-200 dark:border-stone-800';
      case 'ghost': return 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800';
      case 'dragon': return 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800';
      case 'dark': return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800';
      case 'steel': return 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border-slate-200 dark:border-slate-800';
      case 'fairy': return 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800';
      default: return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getTypeGlow = (type: string) => {
    switch (type) {
      case 'fire': return 'from-red-200/50 to-orange-200/50';
      case 'water': return 'from-blue-200/50 to-cyan-200/50';
      case 'grass': return 'from-green-200/50 to-emerald-200/50';
      case 'electric': return 'from-yellow-200/50 to-amber-200/50';
      case 'ice': return 'from-cyan-200/50 to-blue-200/50';
      case 'fighting': return 'from-orange-200/50 to-red-200/50';
      case 'poison': return 'from-purple-200/50 to-pink-200/50';
      case 'ground': return 'from-amber-200/50 to-yellow-200/50';
      case 'flying': return 'from-indigo-200/50 to-purple-200/50';
      case 'psychic': return 'from-pink-200/50 to-purple-200/50';
      case 'bug': return 'from-lime-200/50 to-green-200/50';
      case 'rock': return 'from-stone-200/50 to-gray-200/50';
      case 'ghost': return 'from-violet-200/50 to-purple-200/50';
      case 'dragon': return 'from-indigo-200/50 to-purple-200/50';
      case 'dark': return 'from-gray-200/50 to-slate-200/50';
      case 'steel': return 'from-slate-200/50 to-gray-200/50';
      case 'fairy': return 'from-pink-200/50 to-rose-200/50';
      default: return 'from-gray-200/50 to-slate-200/50';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'fire': return 'text-red-700 dark:text-red-300';
      case 'water': return 'text-blue-700 dark:text-blue-300';
      case 'grass': return 'text-green-700 dark:text-green-300';
      case 'electric': return 'text-yellow-700 dark:text-yellow-300';
      case 'ice': return 'text-cyan-700 dark:text-cyan-300';
      case 'fighting': return 'text-orange-700 dark:text-orange-300';
      case 'poison': return 'text-purple-700 dark:text-purple-300';
      case 'ground': return 'text-amber-700 dark:text-amber-300';
      case 'flying': return 'text-indigo-700 dark:text-indigo-300';
      case 'psychic': return 'text-pink-700 dark:text-pink-300';
      case 'bug': return 'text-lime-700 dark:text-lime-300';
      case 'rock': return 'text-stone-700 dark:text-stone-300';
      case 'ghost': return 'text-violet-700 dark:text-violet-300';
      case 'dragon': return 'text-indigo-700 dark:text-indigo-300';
      case 'dark': return 'text-gray-700 dark:text-gray-300';
      case 'steel': return 'text-slate-700 dark:text-slate-300';
      case 'fairy': return 'text-pink-700 dark:text-pink-300';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeBadgeBackground = (type: string) => {
    switch (type) {
      case 'fire': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'water': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'grass': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'electric': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'ice': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'fighting': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'poison': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'ground': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'flying': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'psychic': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'bug': return 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800';
      case 'rock': return 'bg-stone-100 dark:bg-stone-900/30 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800';
      case 'ghost': return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800';
      case 'dragon': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'dark': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
      case 'steel': return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
      case 'fairy': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary/30"></div>
        </div>
        <p className="text-muted-foreground animate-pulse">Loading Pokemon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search Pokemon by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPokemon.map((pokemon, index) => {
          const mainType = pokemon.types[0]; // Get the primary type
          const typeBackground = getTypeBackground(mainType);
          const typeGlow = getTypeGlow(mainType);
          const typeTextColor = getTypeTextColor(mainType);
          const typeBadgeBackground = getTypeBadgeBackground(mainType);

          return (
            <Card
              key={pokemon.id}
              onClick={() => onPokemonSelect(pokemon)}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 border-2 backdrop-blur-sm overflow-hidden ${typeBackground}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${typeGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardContent className="p-6 relative">
                {/* Pokemon Image with Glow Effect */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-r ${typeGlow} rounded-full blur-xl group-hover:blur-2xl transition-all duration-300`} />
                  <div className="relative bg-gradient-to-br from-background/90 to-background/70 rounded-full p-4 w-32 h-32 mx-auto flex items-center justify-center backdrop-blur-sm">
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-24 h-24 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Pokemon Info */}
                <div className="text-center space-y-3">
                  {/* ID Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${typeBadgeBackground}`}>
                    #{pokemon.id.toString().padStart(4, '0')}
                  </div>

                  {/* Name */}
                  <h3 className={`text-xl font-bold capitalize group-hover:scale-105 transition-all duration-200 ${typeTextColor}`}>
                    {pokemon.name}
                  </h3>

                  {/* Types */}
                  <div className="flex gap-2 justify-center flex-wrap">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className={`capitalize flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          type === 'grass' 
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30'
                            : type === 'poison'
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
                            : type === 'fire'
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-700 border-red-500/30 hover:from-red-500/30 hover:to-orange-500/30'
                            : type === 'water'
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30'
                            : type === 'electric'
                            ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30'
                            : type === 'ice'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30'
                            : type === 'fighting'
                            ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-700 border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30'
                            : type === 'ground'
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 border-amber-500/30 hover:from-amber-500/30 hover:to-yellow-500/30'
                            : type === 'flying'
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-500/30'
                            : type === 'psychic'
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-700 border-pink-500/30 hover:from-pink-500/30 hover:to-purple-500/30'
                            : type === 'bug'
                            ? 'bg-gradient-to-r from-lime-500/20 to-green-500/20 text-lime-700 border-lime-500/30 hover:from-lime-500/30 hover:to-green-500/30'
                            : type === 'rock'
                            ? 'bg-gradient-to-r from-stone-500/20 to-gray-500/20 text-stone-700 border-stone-500/30 hover:from-stone-500/30 hover:to-gray-500/30'
                            : type === 'ghost'
                            ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 border-violet-500/30 hover:from-violet-500/30 hover:to-purple-500/30'
                            : type === 'dragon'
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-500/30'
                            : type === 'dark'
                            ? 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-500/30 hover:from-gray-500/30 hover:to-gray-600/30'
                            : type === 'steel'
                            ? 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 border-slate-500/30 hover:from-slate-500/30 hover:to-gray-500/30'
                            : type === 'fairy'
                            ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-700 border-pink-500/30 hover:from-pink-500/30 hover:to-rose-500/30'
                            : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-500/30 hover:from-gray-500/30 hover:to-gray-600/30'
                        }`}
                      >
                        {getTypeIcon(type)}
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`flex items-center justify-center gap-2 text-xs ${typeTextColor} opacity-70`}>
                      <Sparkles className="w-3 h-3" />
                      <span>Click to view details</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPokemon.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pokemon found</h3>
            <p className="text-muted-foreground">Try searching for a different Pokemon name or ID.</p>
          </div>
        </div>
      )}
    </div>
  );
} 