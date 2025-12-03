/**
 * Poem Generator for VerseCraft: Poetic Product Narratives
 * Generates poems that describe the URL shortening product's purpose and value.
 */

// Collection of poems about URL shortening
const PRODUCT_POEMS = [
  {
    title: 'The Journey of a Link',
    lines: [
      'In the realm of endless links so long,',
      'VerseCraft sings its shortening song.',
      'Each URL transformed with care,',
      'A tiny path through digital air.',
      '',
      'Clicks are counted, journeys tracked,',
      'Every visit, every fact.',
      'From referrer to destination\'s door,',
      'Analytics reveal so much more.',
      '',
      'Share your links across the land,',
      'Watch the data close at hand.',
      'In this dashboard, stories grow—',
      'Where your shortened URLs go.',
    ],
  },
  {
    title: 'Digital Connections',
    lines: [
      'A link too long, a path unclear,',
      'We shorten it and bring it near.',
      'Through digital waves and bytes we send,',
      'A shortened URL to share with friend.',
      '',
      'Each click a story, each view a tale,',
      'Our analytics never fail.',
      'From desktop screens to mobile bright,',
      'We track each journey through the night.',
      '',
      'Connect the world with links so small,',
      'Yet powerful enough to reach them all.',
      'In shortened form, ideas take flight,',
      'Making the web both brief and bright.',
    ],
  },
  {
    title: 'The Art of Brevity',
    lines: [
      'Long URLs sprawl across the page,',
      'Like verses from a lengthy sage.',
      'But we condense with artful grace,',
      'Creating links that take less space.',
      '',
      'With every short code that we make,',
      'A cleaner path for sharing\'s sake.',
      'The analytics dashboard shows,',
      'Where each abbreviated journey goes.',
      '',
      'From complex strings to simple form,',
      'We help your links outshine the norm.',
      'Track your clicks and see them grow,',
      'The power of short links on show.',
    ],
  },
];

/**
 * Generates a poem about the URL shortening product.
 * @returns A formatted poem string with line breaks
 */
export function generatePoem(): string {
  const randomIndex = Math.floor(Math.random() * PRODUCT_POEMS.length);
  const selectedPoem = PRODUCT_POEMS[randomIndex];
  return selectedPoem.lines.join('\n');
}

/**
 * Gets the poem lines as an array for more flexible rendering.
 * @returns An array of poem line strings
 */
export function getPoemLines(): string[] {
  const randomIndex = Math.floor(Math.random() * PRODUCT_POEMS.length);
  const selectedPoem = PRODUCT_POEMS[randomIndex];
  return selectedPoem.lines;
}

/**
 * Gets a specific poem by index.
 * @param index - The index of the poem to retrieve
 * @returns The poem object with title and lines
 */
export function getPoemByIndex(index: number): { title: string; lines: string[] } {
  const safeIndex = Math.abs(index) % PRODUCT_POEMS.length;
  return PRODUCT_POEMS[safeIndex];
}

/**
 * Gets all available poems.
 * @returns Array of all poem objects
 */
export function getAllPoems(): { title: string; lines: string[] }[] {
  return [...PRODUCT_POEMS];
}

/**
 * Gets the total number of available poems.
 * @returns The count of available poems
 */
export function getPoemCount(): number {
  return PRODUCT_POEMS.length;
}
