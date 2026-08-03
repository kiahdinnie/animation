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
  name: "Your Name",                    // <-- put your name here
  tagline: "Animation, motion graphics, modelling, rigging, rendering.",

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
  // These are SAMPLES so you can see the layout working. Replace them with your
  // own Vimeo links. Add or remove { } blocks freely.
  videos: [
    {
      url: "https://vimeo.com/76979871",
      title: "Showreel 2025",
      description: "A 90-second cut of my best recent work — animation, motion graphics and 3D.",
      orientation: "landscape"
    },
    {
      url: "https://vimeo.com/76979871",
      title: "Character Rig & Animation",
      description: "Full body rig and a walk-cycle test. Blender + custom controls.",
      orientation: "portrait"
    },
    {
      url: "https://vimeo.com/76979871",
      title: "Product Render",
      description: "Lighting and look-dev study, rendered in Cycles.",
      orientation: "landscape"
    },
    {
      url: "https://vimeo.com/76979871",
      title: "Motion Graphics Loop",
      description: "Seamless looping title sequence built in After Effects.",
      orientation: "square"
    }
  ]
};
