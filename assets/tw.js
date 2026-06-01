/* Shared Tailwind (Play CDN) config - loaded right after the CDN <script> on
   every page so the brand palette + dark mode are consistent everywhere.

   BRAND = "Electric Indigo": a single cohesive indigo→violet→fuchsia family.
   To keep the hundreds of existing utility classes working, we REMAP the old
   accent names to the new hues instead of rewriting every class:
       teal-*  -> indigo   (primary accent)
       coral-* -> violet   (secondary accent)
       lime-*  -> fuchsia  (tertiary accent, used in 3-stop gradients/blobs)
   Want a different brand colour later? Change these three ramps only. */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // primary accent (was "teal") -> Indigo
        teal: {
          50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",
          500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b"
        },
        // secondary accent (was "coral") -> Violet
        coral: {
          50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",
          500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95"
        },
        // tertiary accent (was "lime") -> Fuchsia
        lime: {
          50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",
          500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "Helvetica", "Arial", "sans-serif"]
      }
    }
  }
};
