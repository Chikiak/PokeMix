import { type PokemonPreview as PokemonPreviewType } from '../types/pokemon';
import { Link } from 'react-router-dom';
import { typeColors } from '../lib/constants';
import '../styles/PokemonDetailPage.css';

interface PokemonPreviewProps {
    pokemon: PokemonPreviewType;
}

function PokemonPreview({ pokemon }: PokemonPreviewProps) {
    return (
        <div className="pokemon-details-container">
            <Link to={`/pokemon/${pokemon.id}`}>
                <img
                    src={pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default ?? ''}
                    alt={pokemon.name}
                    className="pokemon-image"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </Link>
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

export default PokemonPreview;