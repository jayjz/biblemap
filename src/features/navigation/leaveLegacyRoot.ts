// Next treats a link from an initial /#fragment to / as the same route and does
// not notify the native URL subscriptions. Exit that historical view with one
// ordinary document navigation. Canonical /nineveh/ and /explore/ keep Next links.
// The link's real href also works with JavaScript disabled.
export function leaveLegacyRoot(event: { preventDefault: () => void }) {
  if (window.location.pathname === "/") {
    event.preventDefault();
    window.location.assign("/");
  }
}
