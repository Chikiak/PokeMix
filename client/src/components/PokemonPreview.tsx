import { useState, useEffect } from 'react';
import { type PokemonPreview as PokemonPreviewType } from '../types/pokemon';
import { Link } from 'react-router-dom';
import { typeColors } from '../lib/constants';
import '../styles/PokemonDetailPage.css';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

interface PokemonPreviewProps {
    pokemon: PokemonPreviewType;
}

function PokemonPreview({ pokemon }: PokemonPreviewProps) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [pokemon.id]);

    return (
        <div className="pokemon-details-container">
            <Link to={`/pokemon/${pokemon.id}`}>
                <img
                    src={pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default ?? ''}
                    alt={pokemon.name}
                    className="pokemon-image"
                    style={{ display: imageLoading || imageError ? 'none' : 'block' }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                    }}
                />
            </Link>
            {imageLoading && <LoadingSpinner />}
            {imageError && <ErrorMessage message="No se pudo cargar la imagen." />}
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