const SYNODIC_MONTH = 29.53058867;
const KNOWN_NEW_MOON = new Date('2023-01-21T20:53:00Z').getTime();

const getDaysSinceNewMoon = (date: Date): number => {
  const timeSince = date.getTime() - KNOWN_NEW_MOON;
  return timeSince / (1000 * 60 * 60 * 24);
};

export const getMoonPhase = (date: Date = new Date(), t: (key: string) => string) => {
  const daysSinceNew = getDaysSinceNewMoon(date);
  const phase = (daysSinceNew % SYNODIC_MONTH) / SYNODIC_MONTH;

  const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * phase));
  
  const phaseIndex = Math.floor(phase * 8 + 0.5) & 7;

  let ratingKey = '';
  if (illumination <= 15) ratingKey = 'newMoon';
  else if (illumination <= 40) ratingKey = 'crescent';
  else if (illumination <= 60) ratingKey = 'quarter';
  else if (illumination <= 90) ratingKey = 'gibbous';
  else ratingKey = 'fullMoon';

  const phaseName = t(`moon.phases.${phaseIndex}`);
  const emoji = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][phaseIndex];

  return {
    phaseName,
    illumination: Math.round(illumination * 100),
    phaseValue: phase,
    emoji,
    ratingKey,
  };
};

export const getNextMajorPhase = (date: Date = new Date(), t: (key: string) => string) => {
    const daysSinceNew = getDaysSinceNewMoon(date);
    const currentCycleAgeInDays = daysSinceNew % SYNODIC_MONTH;

    let targetAgeInDays: number;
    let nextPhaseName: string;

    const firstQuarterAge = SYNODIC_MONTH * 0.25;
    const fullMoonAge = SYNODIC_MONTH * 0.5;
    const lastQuarterAge = SYNODIC_MONTH * 0.75;
    const nextNewMoonAge = SYNODIC_MONTH;
    
    const adjustedAge = currentCycleAgeInDays + 0.001;

    if (adjustedAge < firstQuarterAge) {
        targetAgeInDays = firstQuarterAge;
        nextPhaseName = t('moon.phases.2'); // First Quarter
    } else if (adjustedAge < fullMoonAge) {
        targetAgeInDays = fullMoonAge;
        nextPhaseName = t('moon.phases.4'); // Full Moon
    } else if (adjustedAge < lastQuarterAge) {
        targetAgeInDays = lastQuarterAge;
        nextPhaseName = t('moon.phases.6'); // Last Quarter
    } else {
        targetAgeInDays = nextNewMoonAge;
        nextPhaseName = t('moon.phases.0'); // New Moon
    }

    const daysUntil = targetAgeInDays - currentCycleAgeInDays;
    const nextPhaseDate = new Date(date.getTime() + daysUntil * 24 * 60 * 60 * 1000);

    return {
        name: nextPhaseName,
        date: nextPhaseDate,
    };
};
