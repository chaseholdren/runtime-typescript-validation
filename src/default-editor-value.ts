// const Validator = require('./validate');
import Validator from './validate';

export interface SingleGame {
     /**
     * The length of the game.
     *
     * @minimum 0
     * @TJS-type integer
     */
    length?: number;
    stage?: MeleeStageName;
    asCharacter?: MeleeCharacterName;
    againstPlayer: string;
    againstCharacter?: MeleeCharacterName;
    didWin: boolean;
}

enum MeleeStageName {
    fountainOfDreams = 'Fountain of Dreams',
    pokemonStadium = 'Pokémon Stadium',
    princessPeachsCastle = 'Princess Peach\'s Castle',
    kongoJungle = 'Kongo Jungle',
    brinstar = 'Brinstar',
    corneria = 'Corneria',
    yoshisStory = 'Yoshi\'s Story ',
    onett = 'Onett',
    muteCity = 'Mute City',
    rainbowCruise = 'Rainbow Cruise',
    jungleJapes = 'Jungle Japes',
    greatBay = 'Great Bay',
    hyruleTemple = 'Hyrule Temple',
    brinstarDepths = 'Brinstar Depths',
    yoshisIsland = 'Yoshi\'s Island',
    greenGreens = 'Green Greens',
    fourside = 'Fourside',
    mushroomKingdomOne = 'Mushroom Kingdom I',
    mushroomKingdomTwo = 'Mushroom Kingdom II',
    venom = 'Venom',
    pokeFloats = 'Poké Floats',
    bigBlue = 'Big Blue',
    icicleMountain = 'Icicle Mountain',
    icetop = 'Icetop',
    flatZone = 'Flat Zone',
    dreamLandN64 = 'Dream Land N64',
    yoshisIslandN64 = 'Yoshi\'s Island N64',
    kongoJungleN64 = 'Kongo Jungle N64',
    battlefield = 'Battlefield',
    finalDestination = 'Final Destination',
}

enum MeleeCharacterName {
    bowser = 'Bowser',
    donkeyKong = 'Donkey Kong',
    doc = 'Dr. Mario',
    falco = 'Falco',
    falcon = 'Falcon',
    fox = 'Fox',
    gameAndWatch = 'Game & Watch',
    ganondorf = 'Ganondorf',
    iceClimbers = 'Ice Climbers',
    kirby = 'Kirby',
    link = 'Link',
    luigi = 'Luigi',
    mario = 'Mario',
    marth = 'Marth',
    mewtwo = 'Mewtwo',
    ness = 'Ness',
    peach = 'Peach',
    pichu = 'Pichu',
    pikachu = 'Pikachu',
    jigglypuff = 'Jigglypuff',
    roy = 'Roy',
    samus = 'Samus',
    sheik = 'Sheik',
    yoshi = 'Yoshi',
    youngLink = 'Young Link',
    zelda = 'Zelda',
}

export const gameValidator = new Validator<SingleGame>();
