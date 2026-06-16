/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "var(--main)",
        "main-foreground": "var(--main-foreground)",
        "secondary-background": "var(--secondary-background)",
        bg: "var(--bg)",
        bw: "var(--bw)",
        blank: "var(--blank)",
        text: "var(--text)",
        mtext: "var(--mtext)",
        border: "var(--border)",
      },
      borderRadius: {
        base: "var(--border-radius)",
      },
      boxShadow: {
        shadow: "var(--shadow)",
      },
      fontFamily: {
        heading: ["Helvetica Now", "Inter", "sans-serif"],
        base: ["Georgia Pro", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
