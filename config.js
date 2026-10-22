/* ==========================================================
   ~/home — your settings
   Change anything here; main.js reads it. Page text (intro,
   bio, project cards) is in index.html, marked with EDIT.
   ========================================================== */
window.SITE = {

  // shown in the shell prompt, neofetch and boot screen
  handle: "jgruber",

  // where links in the shell point
  links: {
    github: "https://github.com/jgruber96",
    flickr: "https://www.flickr.com/photos/jgruber15/",
    choreCalendar: "https://github.com/jgruber96/chore-calendar",
    iosApp: "https://apps.apple.com/",   // placeholder: swap in the real App Store link once it's live
    // email: "mailto:you@example.com",   // uncomment to list it under `contact`
  },

  // what `about` prints in the shell
  about: "I build small, useful things for the web, self-host too much,\nand take a lot of photos.",

  // "lines of code" stat: counts up to this, then creeps upward
  linesOfCode: 48213,

  // "something random" stat: one of these every few seconds
  random: [
    "42", "3 tabs open", "cat on keyboard", "it works on my machine", "404 socks found", "tabs > spaces",
    "1 rubber duck", "git push --force", "undefined", "NaN", "have you tried rebooting?", "∞ side projects",
    "0 unread (lie)", "sudo make sandwich", "rm -rf boredom", "¯\\_(ツ)_/¯",
  ],
  randomEveryMs: 15000,

  // default colour for first-time visitors: "amber" | "green" | "cyan"
  // (light/dark follows the visitor's system setting)
  defaultTheme: "amber",
};
