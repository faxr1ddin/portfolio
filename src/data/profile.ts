// Every piece of text on the site lives here — edit this file, not the components.

export const profile = {
  name: 'Faxriddin Mo‘ydinxonov',
  firstName: 'Faxriddin',
  lastName: 'Mo‘ydinxonov',
  role: 'iOS Developer',
  intro: 'I build native iOS apps with Swift & SwiftUI — and the backends that power them.',
  location: 'Tashkent, Uzbekistan',
  email: 'faxriddinmoydinxonov7@gmail.com',
  phone: '+998 90 544 53 80',
  phoneHref: 'tel:+998905445380',
  resume: '/Faxriddin_Moydinxonov_CV.pdf',
  // Put a photo at public/me.jpg and set this to '/me.jpg'
  photo: null as string | null,
  links: {
    github: 'https://github.com/faxr1ddin',
    linkedin: 'https://www.linkedin.com/in/faxriddin-mo-ydinxonov-0606992a2',
    upwork: 'https://www.upwork.com/freelancers/~0194cd670f80ed0b9e',
  },
  description:
    'Portfolio of Faxriddin Mo‘ydinxonov — iOS developer from Tashkent building native apps with Swift & SwiftUI, and the backends behind them.',
};

export const stats = [
  { value: 3, suffix: '+', label: 'Years with Swift' },
  { value: 2, suffix: '', label: 'Apps on the App Store' },
  { value: 2, suffix: '', label: 'Languages I speak' },
  { value: 100, suffix: '%', label: 'Native Swift code' },
];

export const about = {
  title: 'An iOS developer who ships',
  text: [
    'iOS developer with 2–3 years of hands‑on experience building and publishing apps on the App Store.',
    'I build with Swift and SwiftUI, using MVVM and clean architecture. When a project needs it, I also build the backend — like the NestJS server behind Quronim.',
    'I care about clean code, smooth UX and actually shipping.',
  ],
  education: { title: 'PDP University', sub: 'BTEC Level 3–4 · Tashkent', when: '2024 — 2028' },
  cards: [
    { icon: 'device', title: 'Native iOS', text: 'Swift, SwiftUI and UIKit — apps that feel right on iPhone.' },
    { icon: 'server', title: 'Backend too', text: 'NestJS, PostgreSQL and realtime sockets when the app needs a server.' },
    { icon: 'rocket', title: 'Shipped', text: 'Two apps released on the App Store, from first commit to release.' },
    { icon: 'layers', title: 'Clean code', text: 'MVVM, clean architecture and code that’s easy to maintain.' },
  ],
};

export const skills = [
  { group: 'Languages', items: ['Swift', 'TypeScript'] },
  { group: 'UI', items: ['SwiftUI', 'UIKit', 'WidgetKit'] },
  { group: 'Architecture', items: ['MVVM', 'MVC', 'Clean Architecture'] },
  { group: 'Networking', items: ['URLSession', 'Alamofire', 'REST APIs', 'Socket.io'] },
  { group: 'Data', items: ['Core Data', 'PostgreSQL', 'Prisma'] },
  { group: 'Apple & Firebase', items: ['Combine', 'async/await', 'Firebase Auth', 'Cloud Messaging'] },
  { group: 'Backend', items: ['NestJS', 'Swagger', 'Docker'] },
  { group: 'Tools', items: ['Xcode', 'Git', 'GitHub', 'GitLab', 'CocoaPods', 'CI/CD'] },
];

export type Project = {
  name: string;
  cover: 'gallery' | 'icon';
  color: string;
  badge: string;
  tagline: string;
  text: string;
  points: string[];
  tags: string[];
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    name: 'Quronim',
    cover: 'gallery',
    color: '#16305c',
    badge: 'On the App Store',
    tagline: 'Read, complete and memorize the Qur’an — together',
    text: 'Read with tajweed, share the 30 juz in a group khatm, count dhikr together and watch your hifz grow.',
    points: ['Core iOS screens in SwiftUI', 'Whole backend: NestJS + PostgreSQL', 'Live group progress & push notifications'],
    tags: ['Swift', 'SwiftUI', 'Combine', 'NestJS', 'PostgreSQL', 'Socket.io'],
    link: { label: 'App Store', href: 'https://apps.apple.com/uz/app/quronim/id6761808860' },
  },
  {
    name: 'MiftahulQur’an',
    cover: 'icon',
    color: '#cfc6b0',
    badge: 'Team project',
    tagline: 'A structured way to read the Qur’an',
    text: 'A Qur’an reading app built and released on the App Store with a team.',
    points: ['Feature development with the team', 'Refactoring for clean, maintainable code', 'Consistent UI across the app'],
    tags: ['Swift', 'UIKit', 'Core Data', 'CocoaPods'],
  },
];

// Captions for the Quronim screenshots in src/assets/quronim (matched by file order)
export const quronimShots = [
  'Read the Qur’an with tajweed',
  'Complete the Qur’an together',
  'Count your dhikr with every tap',
  'Watch your hifz grow',
  'Pick a juz and mark it done',
  'Join a khatm in one tap',
];

export const experience = [
  {
    title: 'iOS Developer',
    when: 'Nov 2025 — Apr 2026',
    org: 'Quronim',
    place: 'Tashkent, Uzbekistan',
    text: 'Built core SwiftUI modules, login and live group features — and the NestJS backend behind them.',
  },
  {
    title: 'iOS Developer',
    when: 'Team project',
    org: 'MiftahulQur’an',
    place: 'Tashkent, Uzbekistan',
    text: 'Worked on features and refactoring for a Qur’an reading app released on the App Store.',
  },
  {
    title: 'Student',
    when: '2024 — 2028',
    org: 'PDP University',
    place: 'Tashkent, Uzbekistan',
    text: 'BTEC Level 3–4 — studying while building real apps.',
    tag: 'Education',
  },
  {
    title: 'iOS Course',
    when: '2023 — 2024',
    org: 'Integer Academy',
    place: 'Andijan, Uzbekistan',
    text: 'Where it started: Swift, UIKit and shipping my first iOS apps.',
    tag: 'Education',
  },
];
