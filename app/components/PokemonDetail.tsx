'use client';

import { useState, useEffect } from 'react';
import { Pokemon, PokemonStat } from '../types/pokemon';

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
}

export default function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  
  if (!pokemon) return null;

  useEffect(() => {
    if (pokemon && activeTab === 'about') {
      fetchSpeciesData();
    }
  }, [pokemon, activeTab]);

  const fetchSpeciesData = async () => {
    if (!pokemon) return;
    
    try {
      setLoadingSpecies(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      const data = await response.json();
      
      setSpeciesData(data);
    } catch (error) {
      console.error('Error fetching species data:', error);
    } finally {
      setLoadingSpecies(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
              {pokemon.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="text-center mb-6">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto object-contain"
            />
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              #{pokemon.id.toString().padStart(4, '0')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'stats', label: 'Base Stats' },
                { id: 'evolution', label: 'Evolution' },
                { id: 'moves', label: 'Moves' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'about' && (
              <div>
                {/* Types */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Types
                  </h3>
                  <div className="flex gap-2">
                    {pokemon.types.map((type: string) => (
                      <span
                        key={type}
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
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

                {/* Physical Characteristics */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Physical Characteristics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Height</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {pokemon.height / 10}m
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {pokemon.weight / 10}kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Species Information */}
                {loadingSpecies ? (
                  <div className="mb-4">
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  </div>
                ) : speciesData ? (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Species Information
                    </h3>
                    <div className="space-y-3">
                      {/* Genus */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Genus</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {speciesData.genus}
                        </p>
                      </div>

                      {/* Generation */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Generation</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {speciesData.generation.name.replace('-', ' ')}
                        </p>
                      </div>

                      {/* Habitat */}
                      {speciesData.habitat && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Habitat</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {speciesData.habitat.name.replace('-', ' ')}
                          </p>
                        </div>
                      )}

                      {/* Egg Groups */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Egg Groups</p>
                        <div className="flex gap-2 mt-1">
                          {speciesData.egg_groups.map((group) => (
                            <span
                              key={group.name}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 capitalize"
                            >
                              {group.name.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Growth Rate */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {speciesData.growth_rate.name.replace('-', ' ')}
                        </p>
                      </div>

                      {/* Capture Rate */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Capture Rate</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {speciesData.capture_rate}
                        </p>
                      </div>

                      {/* Base Happiness */}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Base Happiness</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {speciesData.base_happiness}
                        </p>
                      </div>

                      {/* Description */}
                      {speciesData.flavor_text_entries && speciesData.flavor_text_entries.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {speciesData.flavor_text_entries
                              .filter(entry => entry.language.name === 'en')
                              .slice(0, 1)
                              .map(entry => entry.flavor_text.replace(/\f|\n|\r/g, ' '))
                              .join(' ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Abilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Abilities
                  </h3>
                  <div className="space-y-1">
                    {pokemon.abilities.map((ability: string) => (
                      <p
                        key={ability}
                        className="text-gray-700 dark:text-gray-300 capitalize"
                      >
                        {ability}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Base Stats
                </h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat: PokemonStat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {stat.name.replace('-', ' ')}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {stat.value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((stat.value / 255) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'evolution' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Evolution Chain
                </h3>
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">Evolution data not available</p>
                    <p className="text-sm">This feature requires additional API calls to the evolution chain endpoint.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moves' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Moves
                </h3>
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">Moves data not available</p>
                    <p className="text-sm">This feature requires additional API calls to fetch move data.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 