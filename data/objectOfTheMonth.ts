import { ObjectOfTheMonthData } from '../types';

export const objectOfTheMonthData: { [key: string]: ObjectOfTheMonthData } = {
    'en': {
        name: 'The Andromeda Galaxy (M31)',
        imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/11/m31-the-andromeda-galaxy-1-1.jpg',
        description: "The Andromeda Galaxy is the nearest major galaxy to our own Milky Way and the most distant object in the sky you can see with your unaided eye. It's a breathtaking spiral of several hundred billion stars, hurtling towards us for an eventual cosmic collision billions of years from now.",
        facts: [
            { label: 'Type', value: 'Spiral Galaxy' },
            { label: 'Distance', value: '2.5 million light-years' },
            { label: 'Constellation', value: 'Andromeda' },
            { label: 'Best Viewing', value: 'Autumn/Winter' },
        ],
        findingTips: "On a dark, moonless night, look for the constellation Cassiopeia (shaped like a 'W'). From the central 'V' of the W, trace a line outwards. Andromeda will appear as a faint, elongated smudge of light, even in binoculars."
    },
    'pt-PT': {
        name: 'A Galáxia de Andrómeda (M31)',
        imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/11/m31-the-andromeda-galaxy-1-1.jpg',
        description: "A Galáxia de Andrómeda é a galáxia principal mais próxima da nossa Via Láctea e o objeto mais distante no céu que se pode ver a olho nu. É uma espiral deslumbrante de várias centenas de biliões de estrelas, a dirigir-se na nossa direção para uma eventual colisão cósmica daqui a biliões de anos.",
        facts: [
            { label: 'Tipo', value: 'Galáxia Espiral' },
            { label: 'Distância', value: '2.5 milhões de anos-luz' },
            { label: 'Constelação', value: 'Andrómeda' },
            { label: 'Melhor Altura', value: 'Outono/Inverno' },
        ],
        findingTips: "Numa noite escura e sem lua, procure a constelação de Cassiopeia (em forma de 'W'). A partir do 'V' central do W, trace uma linha para fora. Andrómeda aparecerá como uma mancha de luz ténue e alongada, mesmo com binóculos."
    }
};
