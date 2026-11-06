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
    title: "Chore Calendar",                              // card heading
    description: "A self-hosted calendar for household chores: who's doing what, and when. Runs on my home server.",
    link: "https://github.com/jgruber96/chore-calendar",  // where the card goes when clicked
    badge: "Web app · self-hosted · retired",                     // small label in the top-right corner
    icon: "calendar",   // calendar | phone | camera | code | globe | server | terminal | edit | star
    color: "orange",    // glow color: orange | rose | ice | green
    size: "wide",       // wide = 2/3 width | tall = 1/3 width, double height | small = 1/3 width
    extra: "calendar",  // optional picture in the card: "calendar" | "photos" | "" for none
    tags: []            // little labels at the bottom, e.g. ["Swift", "iCloud"]; [] for none
  },

  {
    title: "Chore Calendar for iPhone",
    description: "The native iPhone and iPad version. Works offline and syncs between family devices over iCloud.",
    link: "https://apps.apple.com/",                      // TODO: replace with the real App Store link
    badge: "iOS · App Store",
    icon: "phone",
    color: "ice",
    size: "tall",
    extra: "",
    tags: ["Swift", "iCloud", "iPadOS"]
  },

  {
    title: "Photos",
    description: "My most viewed and most liked shots.",
    link: "https://www.flickr.com/photos/jgruber15/",
    badge: "Flickr",
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
