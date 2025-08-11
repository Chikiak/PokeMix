export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonType {
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonSprites {
    front_default: string | null; // Puede ser null
    other: {
        'official-artwork': {
            front_default: string | null; // Puede ser null
        };
    };
}

export interface PokemonPreview {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: PokemonSprites;
}
export interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
    };
    is_hidden: boolean;
}
export interface PokemonDetails extends PokemonPreview {
    height: number; // en decímetros
    weight: number; // en hectogramos
    stats: PokemonStat[];
    abilities: PokemonAbility[];
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}