// Site-wide constants

// Page titles for <title> tag
export const PAGE_TITLES: Record<string, string> = {
	"index.md": "bidri",
	"profile.md": "Profile - bidri",
};

// Navigation items
export interface NavItem {
	href: string;
	label: string;
	internal: boolean;
}

export const NAV_ITEMS: NavItem[] = [
	{ href: "/", label: "Home", internal: true },
	{ href: "/profile.html", label: "Profile", internal: true },
	{
		href: "https://bi9dri.github.io/emoklore-arknights-side-oripathy/",
		label: "Side Oripathy",
		internal: false,
	},
];
