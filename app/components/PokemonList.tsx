'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonListProps {
  onPokemonSelect: (pokemon: Pokemon) => void;
}

export default function PokemonList({ onPokemonSelect }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pokemonList.map((pokemon) => (
        <div
          key={pokemon.id}
          onClick={() => onPokemonSelect(pokemon)}
          className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto object-contain mb-3"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-left mb-1">
              #{pokemon.id.toString().padStart(4, '0')}
            </p>
            <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white text-left mb-3">
              {pokemon.name}
            </h3>
            <div className="flex gap-2 justify-start">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    type === 'grass' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : type === 'poison'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : type === 'fire'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : type === 'water'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : type === 'electric'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : type === 'ice'
                      ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
                      : type === 'fighting'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : type === 'ground'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : type === 'flying'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      : type === 'psychic'
                      ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                      : type === 'bug'
                      ? 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200'
                      : type === 'rock'
                      ? 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200'
                      : type === 'ghost'
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
                      : type === 'dragon'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      : type === 'dark'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      : type === 'steel'
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
                      : type === 'fairy'
                      ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 