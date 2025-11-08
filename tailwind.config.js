// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    // "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
                extend: {
                    colors: {
                        "primary": "#007BFF",
                        "background-light": "#F8F9FA",
                        "background-dark": "#101922",
                        "text-light": "#343A40",
                        "text-dark": "#E5E7EB",
                        "border-light": "#DEE2E6",
                        "border-dark": "#4B5563"
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
  darkMode: "class",
}

export default config;