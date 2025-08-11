import { type PokemonListResponse, type PokemonDetails } from '../types/pokemon';

const LIMIT = 20;
export const pokemonApi = {
    getPokemonList: async ({pageParam = 0} : {pageParam?: number}) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${pageParam}`);
        if (!response.ok) {
            throw new Error('Error fetching pokemon list');
        }
        const data: PokemonListResponse = await response.json();

        const nextUrl = data.next ? new URL(data.next) : null;
        const nextOffset = nextUrl ? Number(nextUrl.searchParams.get('offset')) : undefined;

        return{
            results: data.results,
            nextPageParam: nextOffset,
        }
    },

    getPokemonDetail: async (id: number): Promise<PokemonDetails> => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`No se encontró ningún Pokémon con el ID "${id}".`);
            }

            throw new Error(`Error fetching pokemon ${id}`);
        }
        return response.json();
    }
};