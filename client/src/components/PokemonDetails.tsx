import { type PokemonDetails as PokemonDetailsType } from '../types/pokemon';
import { typeColors } from '../lib/constants';

interface PokemonDetailsProps {
    pokemon: PokemonDetailsType;
}

function PokemonDetails({ pokemon }: PokemonDetailsProps) {
    return (
        <div className="pokemon-details-container">
    <img
        src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
    />
    <h1 className="pokemon-detail-name">
        {pokemon.name}
        <span className="pokemon-detail-number"> #{pokemon.id}</span>
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
    );
}

export default PokemonDetails;