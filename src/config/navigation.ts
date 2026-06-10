// Extra nav-menu handles the root layout pre-fetches, beyond the default
// ("main-menu", which is always fetched).
//
// `getNavMenus` is server-only, so the layout must download every menu any widget
// will render and pass them to <NavigationProvider>. The header uses "main-menu"
// (default); the footer widget uses "footer" — so it's listed here.
//
// NOTE (interim): this is a code file. The long-term plan derives these handles
// from the resolved chrome JSON so merchants never edit code — see
// plans/mega-menu/ ("no-code contract"). Until then, add a handle here if a
// widget renders a menu other than "main-menu".
export const extraNavHandles: string[] = ["footer"];
