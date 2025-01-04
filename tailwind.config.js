module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        // Desktop Headings
        "desk-h-1": ["64px", { lineHeight: "96px" }],
        "desk-h-2": ["56px", { lineHeight: "84px" }],
        "desk-h-3": ["48px", { lineHeight: "72px" }],
        "desk-h-4": ["40px", { lineHeight: "60px" }],
        "desk-h-5": ["32px", { lineHeight: "48px" }],
        "desk-h-6": ["28px", { lineHeight: "42px" }],
        "desk-b-1": ["18px", { lineHeight: "27px" }],
        "desk-b-2": ["16px", { lineHeight: "24px" }],
        "desk-b-3": ["14px", { lineHeight: "21px" }],
        "desk-b-4": ["12px", { lineHeight: "18px" }],

        // Mobile Headings
        "mob-h-1": ["40px", { lineHeight: "60px" }],
        "mob-h-2": ["32px", { lineHeight: "48px" }],
        "mob-h-3": ["28px", { lineHeight: "42px" }],
        "mob-h-4": ["24px", { lineHeight: "36px" }],
        "mob-h-5": ["20px", { lineHeight: "30px" }],
        "mob-h-6": ["18px", { lineHeight: "27px" }],
        "mob-b-1": ["18px", { lineHeight: "27px" }],
        "mob-b-2": ["16px", { lineHeight: "24px" }],
        "mob-b-3": ["14px", { lineHeight: "21px" }],
        "mob-b-4": ["12px", { lineHeight: "18px" }],
      },
      colors: {
        "primary-100": "#FFF0C2",
        "primary-200": "#FFE086",
        "primary-300": "#FFD149",
        "primary-400": "#FFC10C",
        "primary-500": "#E3A900",
        "primary-600": "#BB8B00",
        "primary-700": "#926D00",
        "primary-800": "#6A4F00",

        "secondary-100": "#CADAF9",
        "secondary-200": "#95B5F3",
        "secondary-300": "#6090ED",
        "secondary-400": "#2B6BE7",
        "secondary-500": "#1857D1",
        "secondary-600": "#1347AC",
        "secondary-700": "#0F3887",
        "secondary-800": "#0B2861",

        "accent-100": "#B586FF",
        "accent-200": "#6B0CFF",
        "accent-300": "#4900BA",

        "neutral-100": "#E2E2E2",
        "neutral-200": "#CCCCCC",
        "neutral-300": "#B7B7B7",
        "neutral-400": "#A2A2A2",
        "neutral-500": "#8C8C8C",
        "neutral-600": "#777777",
        "neutral-700": "#616161",
        "neutral-800": "#4C4C4C",
        "neutral-900": "#373737",
        "neutral-1000": "#212121",

        "error-100": "#F7B0AA",
        "error-200": "#EE6055",
        "error-300": "#E92D1F",
        "error-400": "#B91F13",
        "error-500": "#83160D",

        "success-100": "#C3E6C1",
        "success-200": "#86CD82",
        "success-300": "#5BBB56",
        "success-400": "#41973C",
        "success-500": "#2E6B2B",

        "warning-100": "#FFE9AA",
        "warning-200": "#FFD355",
        "warning-300": "#FFBD00",
        "warning-400": "#C69200",
        "warning-500": "#8C6800",
        // Add more custom colors if necessary
      },
      animation: {
        pulse: "pulse 1.5s infinite",
        bounce: "bounce 2s infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      screens: {
        // Adjust for your breakpoints
        xs: "450px",
        sm: "600px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
