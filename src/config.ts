// Site-wide configuration

export interface NavItem {
  href: string;
  label: string;
  internal: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', internal: true },
  { href: '/profile', label: 'Profile', internal: true },
  {
    href: 'https://bi9dri.github.io/emoklore-arknights-side-oripathy/',
    label: 'Side Oripathy',
    internal: false,
  },
];

export const PAGE_TITLES: Record<string, string> = {
  '/': 'bidri',
  '/profile': 'Profile - bidri',
};

export const SITE_TITLE = 'bidri';
