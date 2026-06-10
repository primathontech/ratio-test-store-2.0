// Extra nav-menu handles the root layout pre-fetches, BEYOND the backend defaults.
//
// `@shopkit/navigation` always fetches the protected/default menus — "main-menu"
// (header) and "footer" — so you do NOT list those here. Add a handle here only for
// an ADDITIONAL, non-default custom menu a widget renders (e.g. "sales-menu").
//
// (`getNavMenus` is server-only, so the layout downloads every menu up front and
// passes them to <NavigationProvider>; widgets just read via useMenu.)
//
// NOTE (interim): this is a code file. The long-term plan derives handles from the
// resolved chrome JSON so merchants never edit code — see plans/mega-menu/.
export const extraNavHandles: string[] = [];
