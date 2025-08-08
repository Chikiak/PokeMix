import { type PokemonDetails as PokemonDetailsType } from '../types/pokemon';

interface PokemonDetailsProps {
    pokemon: PokemonDetailsType;
}

function PokemonDetails({ pokemon }: PokemonDetailsProps) {
    const typeColors: { [key: string]: string } = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC',
    };

    return (
        <div className="pokemon-details">
            <div className="pokemon-header">
                <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                />
                <div className="pokemon-info">
                    <h1 className="pokemon-detail-name">
                        {pokemon.name} <span className="pokemon-detail-number">#{pokemon.id}</span>
                    </h1>
                    <div className="pokemon-types">
                        {pokemon.types.map((type, index) => (
                            <span
                                key={index}
                                className="type-badge"
                                style={{ backgroundColor: typeColors[type.type.name] || '#68A090' }}
                            >
                {type.type.name}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonDetails;