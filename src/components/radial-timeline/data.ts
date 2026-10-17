export interface TimelineEvent {
  id: string;
  title: string;
  year: number;
  subtitle: string;
  body: string[];
}

export const timelineEventList: TimelineEvent[] = [
  {
    id: 'sketchpad',
    title: 'Sketchpad',
    year: 1962,
    subtitle: 'The first interactive computer graphics system',
    body: [
      "Ivan Sutherland's Sketchpad, developed at MIT, was the first program to use a complete graphical user interface. It allowed users to draw shapes on a CRT screen using a light pen.",
      'Sketchpad introduced revolutionary concepts like hierarchical structures in computer-aided design and the use of constraints — ideas that underpin every modern design tool.',
    ],
  },
  {
    id: 'mother-of-all-demos',
    title: 'Mother of All Demos',
    year: 1968,
    subtitle: "Douglas Engelbart's vision of the future",
    body: [
      'On December 9, 1968, Douglas Engelbart demonstrated almost every fundamental element of modern computing: the mouse, video conferencing, hypertext, word processing, and a windowing system.',
      "This single 90-minute presentation effectively described the next 50 years of computing. Engelbart's NLS (oN-Line System) demonstrated a collaborative, networked computer experience that would not become mainstream for decades.",
    ],
  },
  {
    id: 'mac-icons',
    title: 'Mac Icons',
    year: 1984,
    subtitle: 'The desktop metaphor goes mainstream',
    body: [
      "The original Macintosh introduced the graphical desktop metaphor to a mass audience. Susan Kare's pixel-perfect icons — the trash can, folder, and paintbrush — became the visual language of personal computing.",
      'These 32×32 pixel images had to be immediately recognizable without color or animation, establishing icon design principles that still govern UI design today.',
    ],
  },
  {
    id: 'www',
    title: 'World Wide Web',
    year: 1989,
    subtitle: 'Tim Berners-Lee proposes a global hypertext system',
    body: [
      'Tim Berners-Lee wrote "Information Management: A Proposal" at CERN, describing a system of interconnected hypertext documents. His boss wrote "Vague but exciting" on the cover sheet.',
      'The Web democratized access to information and created a new design medium — one where documents could link to any other document anywhere in the world.',
    ],
  },
  {
    id: 'star7',
    title: 'Star7',
    year: 1991,
    subtitle: 'Touch, animation, and connected devices',
    body: [
      'The Star7 was a prototype handheld device from Sun Microsystems featuring a touchscreen, animated UI, and wireless networking — in 1991. It was designed as a universal remote control for the home.',
      'The software built for Star7 was written in a language called Oak, which was later renamed Java. The device never shipped, but it demonstrated a touch-first, connected device nearly two decades before the iPhone.',
    ],
  },
  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll',
    year: 2006,
    subtitle: 'The pattern that ate attention',
    body: [
      'Aza Raskin invented infinite scroll while working at Humanized. The idea was simple: instead of pagination, content loads automatically as you reach the bottom of the page.',
      'Raskin later publicly apologized for the invention, estimating it wastes about 200,000 hours of human attention every day. It remains one of the most widely deployed — and most criticized — UI patterns ever created.',
    ],
  },
  {
    id: 'hashtag',
    title: 'Hashtag',
    year: 2007,
    subtitle: 'Organizing the unstructured web',
    body: [
      'Chris Messina proposed using the # symbol on Twitter to group related messages together. Twitter initially rejected the idea, thinking it was "too nerdy." Within months it spread organically.',
      'The hashtag transformed social media into a searchable, categorized medium and moved into mainstream culture, eventually being added to the Oxford English Dictionary in 2014.',
    ],
  },
  {
    id: 'like-button',
    title: 'Like Button',
    year: 2009,
    subtitle: 'Reducing reaction to a single click',
    body: [
      'Facebook launched the Like button on February 9, 2009. What seemed like a minor feature redesigned the social contract of the internet — reducing nuanced responses to a single positive signal.',
      "The button's design (thumb up, simple count) has been studied extensively. Its dopamine feedback loop is credited with transforming social media from communication tools into engagement engines.",
    ],
  },
  {
    id: 'figma',
    title: 'Figma',
    year: 2016,
    subtitle: 'Design moves to the browser',
    body: [
      'Figma launched in 2016 as the first fully browser-based professional design tool. By moving design into the browser, it made real-time collaboration — multiple cursors, shared components, live updates — trivially easy.',
      "Figma didn't just change the tool; it changed the workflow. Developers, designers, and stakeholders could view and comment on designs in the same environment, collapsing the handoff gap.",
    ],
  },
  {
    id: 'iphone-x',
    title: 'iPhone X',
    year: 2017,
    subtitle: 'Gesture navigation replaces the button',
    body: [
      'The iPhone X eliminated the home button that had defined smartphone interaction since 2007. In its place: a swipe-up gesture to go home, a swipe-and-hold to switch apps, and Face ID replacing Touch ID.',
      'This forced a rethinking of navigation conventions across the entire mobile industry. Gestures replaced affordances, demanding users learn invisible interactions — a gamble that paid off as the new normal.',
    ],
  },
  {
    id: 'ipad-pointer',
    title: 'iPad Pointer',
    year: 2020,
    subtitle: 'The cursor, reimagined for touch',
    body: [
      'iPadOS 13.4 introduced pointer support — but not a simple cursor transplant. Apple designed a morphing pointer that snaps to buttons, transforms into a text insertion bar, and adapts to the element under it.',
      'The iPad pointer explored what a cursor means when touch is the primary input, treating the pointer as a contextual tool rather than a persistent pixel-precise coordinate.',
    ],
  },
  {
    id: 'clash',
    title: 'Clash',
    year: 2012,
    subtitle: 'Timeline-based animation for the web',
    body: [
      'Clash was an early tool for creating timeline-based animations for the web, allowing designers to produce complex motion without writing code.',
      "It represented the industry's first serious attempt to bring After Effects-style thinking into the browser design workflow.",
    ],
  },
  {
    id: 'dynamic-island',
    title: 'Dynamic Island',
    year: 2022,
    subtitle: 'Turning a hardware constraint into a design feature',
    body: [
      "Apple's Dynamic Island turned the iPhone 14 Pro's pill-shaped camera cutout into a live, animated UI element. Notifications, activities, and timers morph into and out of the island.",
      'It demonstrated that hardware constraints can be design opportunities — the "notch problem" became a signature feature by treating the hardware cutout as a canvas rather than an obstacle.',
    ],
  },
  {
    id: 'vision-pro',
    title: 'Vision Pro',
    year: 2024,
    subtitle: 'Spatial computing device',
    body: [
      'Integer tempus semper pulvinar. Nullam bibendum elit vitae feugiat congue. Phasellus imperdiet, lacus a mollis congue, tortor ligula euismod tellus, id tristique dui erat eget tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In scelerisque mollis mauris, eu condimentum massa tincidunt id. Vestibulum et consequat libero, at malesuada odio. Cras porttitor metus at enim aliquet pharetra. Donec mollis nisl nec dapibus aliquam. Aliquam facilisis pulvinar justo sed rutrum.',
      'Nullam aliquet scelerisque tincidunt. Quisque lectus nulla, convallis ac dignissim non, rhoncus id est. Pellentesque luctus ornare imperdiet. Vivamus in odio tristique, rhoncus nibh at, placerat ipsum. Donec porta orci ex, ut dignissim quam pretium eleifend.',
    ],
  },
];
