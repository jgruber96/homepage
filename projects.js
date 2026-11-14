/* ==========================================================================
   PROJECTS — the cards in the "Things I've shipped" section.

   Cards appear on the page in the same order as this list.

   TO ADD A PROJECT:    copy one whole { ... } block below, including the comma
                        after its closing brace, paste it where you want it,
                        and change the values.
   TO REMOVE A PROJECT: delete its whole { ... } block (and its comma).
   TO REORDER:          move the blocks up or down.

   Rules for editing values:
   - Text goes inside "double quotes".
   - If your text contains a double quote, use a curly one (“ ”) or \" instead.
   - Every line inside a block ends with a comma, except the last one is optional.
   ========================================================================== */

window.PROJECTS = [

  {
    title: "StarChores",                                  // card heading
    description: "An iPhone and iPad app where parents and kids share one chore list. Finished chores earn rewards, so everyone stays motivated. Built completely in SwiftUI, based on my Chore Calendar web app.",
    link: "https://darkstardev.us/starchores/",           // where the card goes when clicked
    badge: "iOS · App Store",                             // small label in the top-right corner
    icon: "star",       // calendar | phone | camera | code | globe | server | terminal | edit | star
    color: "orange",    // glow color: orange | rose | ice | green
    size: "wide",       // wide = 2/3 width | tall = 1/3 width, double height | small = 1/3 width
    extra: "calendar",  // optional picture in the card: "calendar" | "photos" | "editor" | "" for none
    tags: ["SwiftUI", "iOS"]  // little labels at the bottom, e.g. ["Swift", "iCloud"]; [] for none
  },

  {
    title: "Marklet",
    description: "A Markdown editor that stays out of your way. Write with the symbols showing, beside the rendered page, or right on it. Notes stay plain text files in a folder you choose. Free, no account. Coming to iPhone and iPad.",
    link: "https://darkstardev.us/marklet/",
    badge: "Windows · Mac",
    icon: "edit",
    color: "ice",
    size: "tall",
    extra: "editor",
    tags: ["Tauri", "Rust", "React", "TypeScript"]
  },

  {
    title: "Photos",
    description: "My photo portfolio, with my favorite shots, at jeffgruber.us.",
    link: "https://jeffgruber.us",
    badge: "jeffgruber.us",
    icon: "camera",
    color: "rose",
    size: "small",
    extra: "photos",
    tags: []
  },

  {
    title: "This site",
    description: "Hand-written HTML, CSS and JS. No framework, no tracking.",
    current: true,      // true = shows a green "You are here" badge instead of a link (badge/link are ignored)
    icon: "code",
    color: "green",
    size: "small",
    extra: "",
    tags: ["HTML", "CSS", "Vanilla JS"]
  }

  /* ---- TEMPLATE: copy everything between the lines below to add a new project ----
     (remember to add a comma after the closing brace of the project above it)

  {
    title: "My New Project",
    description: "One or two sentences about what it does.",
    link: "https://github.com/jgruber96/my-new-project",
    badge: "Web app",
    icon: "globe",
    color: "orange",
    size: "small",
    extra: "",
    tags: ["JavaScript"]
  }

  ---- end of template ---- */

];
