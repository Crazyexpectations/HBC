// ============================================================================
//  EDIT ME — everything on this page is the personal content of the site.
//  Nothing here affects layout or code, it's all just text. Make it yours.
// ============================================================================
import photoManifest from './assets/photoManifest.json';

export const HER_NAME = 'Cherry';
export const YOUR_SIGNATURE = 'Aurin'; // sign the letter with your name / nickname

// ============================================================================
//  THE FIVE WISHES
//
//  Five sealed cards she opens one at a time; the fifth one pops the lid off
//  the gift box underneath.
//
//  These are deliberately the SPECIFIC hopes — her stress, her friends, the
//  house, her health. The letter already covers the general ones ("I hope u
//  meet good people"), so keep these concrete or they're just the letter
//  again in a smaller font.
//
//  Five is not a magic number. Add or remove items freely; the counter, the
//  progress dots and the unlock all read off the length of this array.
// ============================================================================
export const WISHES = {
  title: 'Five Wishes For You',
  subtitle: 'tap each one to open it',
  lockedHint: 'open all five',
  doneTitle: "that's all five 🎁",
  doneText:
    "That's everything I want for you. No conditions on any of it, and nothing you have to give back.",
  items: [
    {
      emoji: '🕊️',
      title: "I hope you don't have any more mental stress",
      text: "Not this year. You've carried enough of it already, for long enough. I hope your head finally gets some quiet.",
    },
    {
      emoji: '👯',
      title: 'I hope you get even closer to your friends',
      text: 'Especially the youth people. I hope they turn into the kind of people you never have to explain yourself to.',
    },
    {
      emoji: '🏡',
      title: 'I hope you build that house',
      text: 'And that you get to make your parents happy exactly the way you always said you would.',
    },
    {
      emoji: '🎭',
      title: 'I hope the fakeass finally gets caught',
      text: "You know the one. Some things sort themselves out eventually — I hope this is the year that one does.",
    },
    {
      emoji: '💪',
      title: 'I hope your health is at 100%',
      text: 'All of it, body and head. You deserve to feel good in your own skin on a completely ordinary day.',
    },
  ],
};

// ============================================================================
//  THE VIDEO
//
//  Put the file at  public/video/for-her.mp4  (or change `src` below — it is
//  relative to the site root, no leading slash). It stays hidden behind the
//  cover until she taps, and `preload="none"` means nothing downloads before
//  that — which matters, because she'll open this on mobile data.
//
//  ⚠️  GitHub refuses any file over 100 MB, so a 6–7 minute video has to be
//  compressed first. See "The video" in the README for the exact command.
// ============================================================================
export const VIDEO = {
  src: 'video/for-her.mp4',
  eyebrow: 'the part I actually want you to see',
  title: 'One More Thing To Watch',
  // On the cover, before she opens it.
  coverTitle: 'A video, just for you',
  coverLines: ['turn your volume all the way up 🔊', 'and please watch it till the very end'],
  coverButton: 'play it ▸',
  // Under the player once it's open.
  playingNote: 'the song will come back on when this finishes',
  // Only ever seen if the file is missing or the browser can't play it.
  failed: "This one didn't load — try refreshing the page?",
};

export const GAMES_HEADING = {
  eyebrow: 'okay, one more thing before cake',
  title: 'Play With Me',
  sub: 'a tiny game, and five things I hope for you',
};

// ============================================================================
//  The rest is written and ready. Rewrite anything you'd say differently.
// ============================================================================

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
    "okay now you're just bullying this button",
    'there is only one correct answer here',
  ],
};

export const LOADING_LINES = [
  'gathering stardust…',
  'folding the paper…',
  'lighting the candles…',
  'writing the rest of it…',
  'almost there…',
];

export const HERO = {
  eyebrow: 'a little universe, just for you',
  title: 'Happy Birthday',
  scrollHint: 'Scroll down. I made you something that took a lot longer than picking out a gift.',
};

// ============================================================================
//  THE LETTER
//
//  Each entry in the array is its own block, and blocks are separated by a
//  paragraph gap on the page. Two small conventions:
//
//    lines('a', 'b', 'c')  → the lines stack tightly, with no gap between
//                            them. Use it for a run of short lines that
//                            belong together ("I hope u… / I hope u… ").
//    '## something'        → renders big, centred and handwritten. Save it
//                            for the two or three lines that should land.
//
//  Nothing else is special — write however you'd actually write.
// ============================================================================

/** Groups a run of short lines into one tightly-stacked block. */
const lines = (...l: string[]) => l.join('\n');

export const LOVE_LETTER: string[] = [
  `Okayyyy so u actually asked for the link 😭🐦`,

  `I told u there was another part because there were so many things I wanted to say and I knew one piece of paper would never be enough`,

  `First of all I hope u know how genuinely happy I am that I got to know u`,

  `When I think about everything that happened between us it's actually crazy how much one person can become a part of your life`,

  lines(
    'From random calls',
    'stupid fights',
    'laughing over the most useless things',
    'eating together',
    'watching things together',
    'making food',
    'going out',
    'all those tiny moments that probably looked completely normal at the time'
  ),

  `somehow those became some of my favourite memories`,

  `And ik things aren't the same anymore`,

  lines(
    "I know u've told me how u feel",
    "I know u don't want me to keep expecting things from u",
    'I know u want to live your life freely',
    "and I know I can't make u love me just because I love u"
  ),

  `I understand that more than u probably think`,

  `I don't want your birthday to become another day where u feel like u have to answer my feelings or give me something back`,

  `So today I just want u to know something`,

  `## I'm proud of u`,

  `Even when u don't feel proud of yourself`,

  `You've gone through so much and somehow you're still trying to figure yourself out and keep going`,

  `And I really hope Ireland gives u some happiness too`,

  lines(
    'I hope u meet good people',
    'I hope u laugh until your stomach hurts',
    "I hope u get to do things you've always wanted to do",
    "I hope u become the version of yourself that you've always wanted to be"
  ),

  `And most importantly I hope u don't forget that u deserve to be happy`,

  `Even if that happiness doesn't include me the way I once imagined it would`,

  `I won't lie and say I've stopped loving u because I haven't`,

  `And I don't know if I'll ever completely stop`,

  `But I'm slowly understanding that loving someone doesn't mean holding onto them so tightly that they can't breathe`,

  `Sometimes loving someone means letting them live their life even when a part of u wishes they would stay`,

  `So I don't want u to read this and feel guilty`,

  lines('I don\'t want u thinking', '“oh god Aurin is still waiting for me so I have to do something”'),

  `Noooo 😭🐦`,

  `This is just me being honest about what is in my heart`,

  lines(
    "You don't owe me a relationship",
    "You don't owe me a future",
    "You don't owe me the same feelings"
  ),

  `But u will always have someone who genuinely wants good things for u`,

  `And maybe one day we'll look back at all of this and laugh at how complicated everything became`,

  lines(
    "Maybe we'll be completely different people by then",
    "Maybe we'll be strangers",
    "Maybe we'll still be somewhere in each other's lives"
  ),

  `I don't know`,

  `And for once I'm not going to pretend that I know what the future is going to look like`,

  `I just know that today is your birthday`,

  lines("So today I don't want to talk about what we were", 'or what we might become'),

  `I just want to say`,

  `## Happy birthday Cherry ❤️`,

  lines(
    'Thank you for every laugh',
    'every stupid conversation',
    'every hug',
    'every memory',
    'every time u made me feel like the happiest idiot alive 🐦'
  ),

  `And wherever life takes u from here`,

  `I genuinely hope it takes u somewhere beautiful`,

  lines(
    'Somewhere u feel loved',
    'somewhere u feel safe',
    "somewhere u don't have to question whether people want u around"
  ),

  `And if someday u look back at this letter`,

  `I hope u don't remember it as the letter from the guy who wouldn't let go`,

  `I hope u remember it as the letter from someone who really, really loved u and wanted to see u happy`,

  `That's all I ever wanted for u`,

  `Happy birthday once again`,

  `## my Cherry Desai 🐦❤️`,
];

export const LETTER = {
  eyebrow: 'the other part I told you about',
  title: "Everything that didn't fit on the paper",
  openHint: 'tap the envelope to open it',
  // Shown once the letter is open, under the first few lines.
  readHint: "keep scrolling — I warned you it was long",
};

// The cards under "Things I'll Always Love About You" — edit freely,
// add or remove as many as you like.
export const REASONS: { emoji: string; title: string; text: string }[] = [
  { emoji: '😄', title: 'Your laugh', text: "Loud, unfiltered, and somehow able to fix an entire bad day in about four seconds." },
  { emoji: '📞', title: 'Our random calls', text: 'Hours about absolutely nothing, and not one of them boring.' },
  { emoji: '😤', title: 'Our stupid fights', text: "Even those I'd take back over silence — at least we were still talking." },
  { emoji: '🍜', title: 'Eating together', text: 'Half my favourite memories are just us, a plate of food, and no plans.' },
  { emoji: '🍳', title: 'Making food', text: 'You turned an ordinary kitchen afternoon into something I still think about.' },
  { emoji: '🎬', title: 'Watching things', text: 'Talking over the entire thing and somehow still remembering every second.' },
  { emoji: '🌧️', title: 'How you keep going', text: "You've been through more than most people know, and you're still trying. That's strength." },
  { emoji: '♾️', title: 'Everything else', text: "A thousand small things I still don't have the words for." },
];

export const REASONS_HEADING = {
  eyebrow: "the things I'd never take back",
  title: "Things I'll Always Love About You",
  sub: 'tap any one of them',
};

export const CAKE = {
  title: 'Make a wish',
  subtitle: 'Tap each candle to light it, then blow into your mic to send your wish into the night.',
  candleCount: 5,
  afterMessage: "Whatever you wished for — I really hope you get it. All of it. 🎂",
};

export const SURPRISE = {
  title: 'One last thing',
  subtitle: 'A wish lantern. Tap it, and let it go.',
  revealTitle: 'There it goes.',
  revealText:
    "Every good thing I want for you is riding on that. Somewhere you feel loved, somewhere you feel safe, somewhere you never have to wonder whether people want you around.",
};

export const ENDING = {
  title: 'Go Be Happy',
  subtitle: `Happy birthday, ${HER_NAME}. Wherever life takes you from here — I really hope it takes you somewhere beautiful.`,
  replay: 'Read it again',
};

// Click hint shown above the photo grid.
export const MEMORIES_HINT = 'go ahead, click on a photo 💗';

export const MEMORIES_HEADING = {
  eyebrow: 'a little time capsule',
  title: 'Our Memories',
  sub: 'every one of these looked completely normal at the time',
};

// Captions for each memory photo, in the same order as the files in "All images".
// Feel free to rewrite every single one — these are placeholders.
const DEFAULT_CAPTIONS = [
  'the day it all began',
  'still my favorite view',
  'us, being us',
  'a good, good day',
  'that smile I fell for',
  "somewhere I'd go back to",
  'quiet moments count too',
  'you, mid-laugh',
  'a memory on replay',
  'this one lives rent-free in my head',
  'exactly where I wanted to be',
  'golden hour, golden us',
  'unplanned and perfect',
  'one of the good ones',
  'i remember this like it was yesterday',
  'you made ordinary days special',
  'this look, though',
  'caught you being cute',
  'a whole mood',
  'proof we had fun',
  'main character energy',
  'us against the world',
  'no caption needed',
  'this was my favorite kind of day',
  'still thinking about this one',
  'you and me, back then',
  'a little piece of us',
  "i'd keep this day forever",
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
  'this is what home looked like',
  'the beginning of something good',
  'i knew even then',
  'time flew when i was with you',
  'this photo lives in my head rent free',
  'a whole era, right here',
  'us, before we knew what we had',
  'one of my favourite people, always',
  'that day i fell a little harder',
  'the way you look at the camera',
  'nothing fancy, just us',
  "i'd relive this whole day",
  'you made every photo better',
  'this is the good stuff',
  'proof i got lucky',
  'you, in your natural habitat',
  'a snapshot of us being happy',
  'the best kind of ordinary',
  'the good old days, while they were happening',
];

export const MEMORIES = photoManifest.map((photo, i) => ({
  ...photo,
  caption: DEFAULT_CAPTIONS[i] ?? 'a memory worth keeping',
}));
