// The Lucidity and Consciousness in Dreams (LuCiD) scale.
// Voss, Schermelleh-Engel, Windt, Frenzel & Hobson (2013), Consciousness and
// Cognition 22, 8-21. https://doi.org/10.1016/j.concog.2012.11.001
// 28 statements rated about a single dream on a 6-point scale
// (0 = strongly disagree ... 5 = strongly agree).

export const LUCID_SCALE_MAX = 5;

// Items 1-28, verbatim from Fig. 2 of the paper.
export const LUCID_ITEMS: string[] = [
    'While dreaming, I was aware of the fact that the things I was experiencing in the dream were not real.',
    'While dreaming, I was able to remember my intention to do certain things in the dream.',
    "While dreaming, I was aware that the self I experienced in my dream wasn't the same as my waking self.",
    'In my dream, I was able to manipulate or control other dream characters in a way that would be impossible in waking.',
    'While dreaming, I thought about other dream characters.',
    'While dreaming I was able to successfully perform supernatural actions (like flying or passing through walls).',
    'The emotions I experienced in my dream were exactly the same as those I would experience in such a situation during wakefulness.',
    'While dreaming, I was aware of the fact that the body I experienced in the dream did not correspond to my real sleeping body.',
    "I was very certain that the things I was experiencing in my dream wouldn't have any consequences on the real world.",
    'While dreaming I was able to successfully control or change the dream environment in a way that would be impossible during wakefulness.',
    'While dreaming, I saw myself from outside.',
    'While dreaming, I thought about my own actions.',
    'While dreaming, I had the feeling that I had forgotten something important.',
    'While dreaming, I was able to change or move objects (not persons) in a way that would be impossible in waking.',
    'While dreaming I was not myself but a completely different person.',
    'While dreaming, I often asked myself whether I was dreaming.',
    'The thoughts I had in my dream were exactly the same as I would have in a similar situation during wakefulness.',
    'While dreaming, I had the feeling that I could remember my waking life.',
    'While dreaming, I was aware of the fact that other dream characters in my dream were not real.',
    'Most things that happened in my dream could have also happened during wakefulness.',
    'I watched the dream from the outside, as if on a screen.',
    'While dreaming, I often thought about the things I was experiencing.',
    'I was able to influence the story line of my dreams at will/at libitum.',
    'While dreaming, I was able to remember certain plans for the future.',
    'While dreaming, I felt euphoric/upbeat.',
    'While dreaming, I had strong negative feelings.',
    'While dreaming, I had strong positive feelings.',
    'While dreaming, I felt very anxious.',
];

export interface LucidFactor {
    // Used in frontmatter keys (lucid-<key>).
    key: string;
    name: string;
    // 1-based item numbers, as assigned in Table 1 of the paper.
    items: number[];
}

export const LUCID_FACTORS: LucidFactor[] = [
    { key: 'insight', name: 'Insight', items: [1, 3, 8, 9, 16, 19] },
    { key: 'control', name: 'Control', items: [4, 6, 10, 14, 23] },
    { key: 'thought', name: 'Thought', items: [5, 12, 22] },
    { key: 'realism', name: 'Realism', items: [7, 17, 20] },
    { key: 'memory', name: 'Memory', items: [2, 13, 18, 24] },
    { key: 'dissociation', name: 'Dissociation', items: [11, 15, 21] },
    { key: 'negative-emotion', name: 'Negative emotion', items: [26, 28] },
    { key: 'positive-emotion', name: 'Positive emotion', items: [25, 27] },
];

export interface LucidScores {
    // Number of items answered, out of LUCID_ITEMS.length.
    answered: number;
    // Mean response per factor, over the answered items of that factor.
    factors: Record<string, number>;
}

// Computes per-factor mean scores from a responses array (index 0 = item 1,
// null = unanswered). Returns null when nothing was answered.
export const computeLucidScores = (responses: (number | null)[]): LucidScores | null => {
    const factors: Record<string, number> = {};
    let answered = 0;
    for (const factor of LUCID_FACTORS) {
        const values = factor.items
            .map((itemNumber) => responses[itemNumber - 1])
            .filter((value): value is number => value !== null && value !== undefined);
        answered += values.length;
        if (values.length > 0) {
            const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
            factors[factor.key] = Math.round(mean * 100) / 100;
        }
    }
    return answered > 0 ? { answered, factors } : null;
};
