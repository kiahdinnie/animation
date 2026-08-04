/* =============================================================================
   YOUR CONTENT — THIS IS THE ONLY FILE YOU NEED TO EDIT
   =============================================================================
   Everything on the site (your name, tagline, contact links, and every video)
   is controlled from this one file. Change the text between the quotes, save,
   and the whole site updates.

   HOW TO ADD A VIDEO:
   1. Go to your video on Vimeo and copy its link, e.g. https://vimeo.com/76979871
   2. Paste it as "url" in a new { } block inside the videos list below.
   3. Give it a title and a short description.
   4. Set "orientation" to "landscape" (wide showreels), "portrait" (phone /
      Instagram-reel shape) or "square".

   Private / unlisted Vimeo videos: the link looks like
   https://vimeo.com/76979871/abc123def — paste the WHOLE thing, the extra code
   after the slash is needed for it to play.
   ========================================================================== */

window.SITE = {
  // ---- YOU ------------------------------------------------------------------
  name: "Kiah Dinnie",                  // <-- put your name here
  tagline: "Animation, motion graphics, modelling, rigging, rendering.",

  // ---- LOOK & FEEL ----------------------------------------------------------
  // Flip the whole site between the light and dark palette with one word:
  theme: "light",                       // "light"  or  "dark"

  // A video that plays behind the WHOLE site (an mp4 in /assets, or a Vimeo link).
  // Leave "" to use the colourful gradient mesh instead.
  pageVideo: "assets/background.mp4",

  // The first panel (the name screen).
  hero: {
    // An animated title video shown at the top (a black background is dropped
    // automatically). Leave "" to use the typed name with the coloured dots.
    title: "assets/title.mp4",

    // What sits behind the title — only used if pageVideo above is "".
    background: "gradient",             // "gradient" | "image" | "video"
    image: "assets/hero.jpg",           // used when background is "image"
    video: "",                          // used when background is "video" — a Vimeo link
    dim: 0.4                            // 0–1: fades an image/video hero so the name stays readable
  },

  // ---- CONTACT (used by the bottom banner, the contact page and the footer) --
  email: "you@example.com",             // <-- your email
  location: "",                         // optional, e.g. "London, UK" (leave "" to hide)

  socials: {
    // Leave any line as "" to hide that link.
    vimeo: "https://vimeo.com/yourname",
    instagram: "",
    linkedin: "",
    youtube: "",
    artstation: ""
  },

  // ---- ABOUT PAGE -----------------------------------------------------------
  about: {
    // Drop a photo of yourself into the /assets folder and name it "profile.jpg"
    // (or change the filename below).
    photo: "assets/profile.jpg",
    // Each string below becomes its own paragraph. Write as many as you like.
    paragraphs: [
      "Write a short intro here — who you are and what you love making. A couple of sentences is plenty.",
      "Add a second paragraph about your experience: the studios or clients you've worked with, the tools you use (Blender, Maya, Houdini, After Effects, Cinema 4D…), and the kind of work you're looking for.",
      "Finish with a line about what you're excited to work on next."
    ],
    // Optional skills list — shown as tags. Delete any you don't want.
    skills: [
      "3D Animation", "Motion Graphics", "Modelling", "Rigging",
      "Rendering", "Lighting", "Compositing", "VFX"
    ]
  },

  // ---- YOUR VIDEOS ----------------------------------------------------------
  // Add or remove { } blocks freely. "orientation" can be "landscape",
  // "portrait" or "square".
  videos: [
    {
      url: "https://vimeo.com/1152648913",
      title: "Animation Showreel",
      description: "A 60-second cut of my animations from Netflix, Showmax, various advertising spots, and a short film.",
      orientation: "landscape"
    },
    {
      url: "https://vimeo.com/1155750523",
      title: "Motion Graphics and Product Visualization",
      description: "I produced all elements of these shots using Blender, After Effects, Photoshop, and Illustrator.",
      orientation: "landscape"
    },
    {
      url: "https://vimeo.com/1201552967",
      title: "Character sculpting and Rigging",
      description: "Characters sculpted in Blender and rigged in both Blender and Autodesk Maya.",
      orientation: "landscape"
    }
  ]
};
