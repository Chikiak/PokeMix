import { type PokemonListResponse, type PokemonDetails } from '../types/pokemon';

export const pokemonApi = {
    getPokemonList: async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error fetching pokemon list');
        }
        return response.json();
    },

    getPokemonDetail: async (id: number | string): Promise<PokemonDetails> => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching pokemon ${id}`);
        }
        return response.json();
    }
};