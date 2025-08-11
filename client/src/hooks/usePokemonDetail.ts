import {useQuery} from '@tanstack/react-query';
import {pokemonApi} from '../services/pokemonApi';

export function usePokemonDetail(pokemonId : number | undefined | null) {
    const isIdValid = typeof pokemonId === 'number' && pokemonId > 0 && !isNaN(pokemonId);

    return useQuery({
        queryKey: ['pokemon', pokemonId],
        queryFn: () => pokemonApi.getPokemonDetail(pokemonId!),
        enabled: isIdValid,
    });
}