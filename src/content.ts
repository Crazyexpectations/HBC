// ============================================================================
//  EDIT ME — everything on this page is the personal content of the site.
//  Nothing here affects layout or code, it's all just text. Make it yours.
// ============================================================================
import photoManifest from './assets/photoManifest.json';

export const HER_NAME = 'Cherry';
export const YOUR_SIGNATURE = 'Your Favourite Person'; // sign the letter with your name / nickname

export const GATE = {
  question: 'Do you love me?',
  yes: 'Yes',
  no: 'No',
  // Playful lines that appear under the buttons as the "No" button keeps escaping.
  teases: [
    'nice try 😏',
    'not today',
    "you can't catch me",
    'wrong answer, try again',
    'I said no to no',
    'she said the "no" button is faster than her ex 💀',
    'okay now you\'re just bullying this button',
    'there is only one correct answer here',
  ],
};

export const LOADING_LINES = [
  'gathering stardust…',
  'wrapping the gift…',
  'lighting the candles…',
  'writing the letter…',
  'almost there…',
];

// The love letter — write from the heart. Each string in the array is its own
// paragraph and will "type out" on screen. Keep paragraphs short-ish so the
// typewriter effect feels good; the site will handle all the animation.
export const LOVE_LETTER: string[] = [
  `My dearest ${HER_NAME},`,
  `Happy birthday. I wanted to build you something instead of just buying you something — because nothing I could wrap in paper says it quite like this does.`,
  `Every photo on this page is a day I'd live again without changing a single second of it. You have this way of making ordinary afternoons feel like the good old days while they're still happening.`,
  `I don't say it enough, so let this page say it for me on repeat: I love the way you laugh at your own jokes before you finish telling them, I love how you save the best bite of food for last, and I love that somehow, out of everyone, you picked me.`,
  `This next year, I just want to keep showing up for you — on the easy days and the hard ones, in the big moments and the tiny ordinary ones in between.`,
  `Happy birthday, my love. Here's to another year of us.`,
  `Forever yours,`,
];

// "Reasons I Love You" cards — edit freely, add/remove as many as you like.
export const REASONS: { emoji: string; title: string; text: string }[] = [
  { emoji: '😄', title: 'Your laugh', text: 'It\'s loud, it\'s unfiltered, and it instantly fixes my worst days.' },
  { emoji: '🫶', title: 'How you care', text: 'You remember the tiny things everyone else forgets — and you always show up.' },
  { emoji: '🍜', title: 'Our food dates', text: 'You make even the simplest meal feel like an event I don\'t want to end.' },
  { emoji: '📚', title: 'Your mind', text: 'The way you see the world makes me see it a little differently too, in the best way.' },
  { emoji: '🌧️', title: 'The hard days', text: 'You stay soft even when life isn\'t — that\'s rarer than people think.' },
  { emoji: '🎶', title: 'Your playlists', text: 'Somehow you always know the exact song for the exact moment.' },
  { emoji: '🏡', title: 'Home', text: 'Wherever you are just... feels like home to me.' },
  { emoji: '♾️', title: 'Everything else', text: 'A thousand tiny reasons I haven\'t even found the words for yet.' },
];

export const CAKE = {
  title: 'Make a wish',
  subtitle: 'Tap each candle to light it, then blow into your mic to send your wish into the night.',
  candleCount: 5,
  afterMessage: 'Whatever you wished for — I hope it comes true. And if it was about us, I already said yes. 🎂',
};

// A little "how well do you know us" quiz. Unlike REASONS above, these
// questions genuinely need YOUR real answers — she should get them right
// (or close to it) because she knows you two, not because they're guessable
// general trivia. `correctIndex` is which option (0-based) is the real
// answer. Get a perfect score and the gift box below the quiz opens.
export const QUIZ = {
  title: 'How Well Do You Know Us?',
  subtitle: 'Get every question right and something opens up below.',
  perfectTitle: 'You unlocked something 🎁',
  perfectText: "Of course you got them all right — you know us better than anyone. I love you.",
  tryAgainText: 'So close — want to try again?',
  questions: [
    {
      question: 'Where was our first date?',
      options: ['Edit me: the real place', 'Edit me: a wrong answer', 'Edit me: another wrong answer'],
      correctIndex: 0,
    },
    {
      question: 'What song do we always end up playing?',
      options: ['Edit me: a wrong answer', 'Edit me: the real song', 'Edit me: another wrong answer'],
      correctIndex: 1,
    },
    {
      question: "What's the nickname I have for you?",
      options: ['Edit me: the real nickname', 'Edit me: a wrong answer', 'Edit me: another wrong answer'],
      correctIndex: 0,
    },
    {
      question: 'Where do I want to travel with you one day?',
      options: ['Edit me: a wrong answer', 'Edit me: another wrong answer', 'Edit me: the real place'],
      correctIndex: 2,
    },
    {
      question: 'What do you always steal off my plate?',
      options: ['Edit me: the real answer', 'Edit me: a wrong answer', 'Edit me: another wrong answer'],
      correctIndex: 0,
    },
  ],
};

export const SURPRISE = {
  title: 'One more thing…',
  subtitle: 'Tap the box.',
  revealTitle: 'For you.',
  revealText: 'Not because it\'s your birthday — because you deserve to be spoiled on every ordinary day too. I love you, endlessly.',
};

export const ENDING = {
  title: 'I Love You Forever',
  subtitle: `Happy Birthday, ${HER_NAME}. Here's to forever, one ordinary day at a time.`,
  replay: 'Watch it again',
};

// Click hint shown above the photo grid.
export const MEMORIES_HINT = 'go ahead, click on a photo 💗';

// Captions for each memory photo, in the same order as the files in "All images".
// Feel free to rewrite every single one — these are placeholders.
const DEFAULT_CAPTIONS = [
  'the day it all began',
  'still my favorite view',
  'us, being us',
  'a good, good day',
  'that smile I fell for',
  'somewhere I\'d go back to',
  'quiet moments count too',
  'you, mid-laugh',
  'a memory on replay',
  'this one lives rent-free in my head',
  'exactly where I want to be',
  'golden hour, golden us',
  'unplanned and perfect',
  'one of the good ones',
  'i remember this like it was yesterday',
  'you make ordinary days special',
  'this look, though',
  'caught you being cute',
  'a whole mood',
  'proof we had fun',
  'main character energy',
  'us against the world',
  'no caption needed',
  'this is my favorite kind of day',
  'still thinking about this one',
  'you and me, always',
  'a little piece of us',
  'here\'s to many more like this',
  'young and in love',
  'we were just getting started',
  'you had my whole attention',
  'that day felt like a movie',
  'i still smile thinking about this',
  'the good kind of chaos',
  'my favorite kind of trouble',
  'we look happy because we were',
  'small moment, big memory',
  'you, unfiltered',
  'this is what home looks like',
  'the beginning of something good',
  'i knew even then',
  'time flew when i was with you',
  'this photo lives in my head rent free',
  'a whole era, right here',
  'us, before we knew what we had',
  'still my favorite person',
  'that day i fell a little harder',
  'the way you look at the camera',
  'nothing fancy, just us',
  'i\'d relive this whole day',
  'you make every photo better',
  'this is the good stuff',
  'proof i got lucky',
  'you, in your natural habitat',
  'a snapshot of us being happy',
  'the best kind of ordinary',
  'here\'s to us, always',
];

export const MEMORIES = photoManifest.map((photo, i) => ({
  ...photo,
  caption: DEFAULT_CAPTIONS[i] ?? 'a memory worth keeping',
}));
