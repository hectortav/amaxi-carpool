import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: "#F2F2F2",
        text: "#5D5D5C",
        main: "#5D5D5C",
        secondary: "#C9C9C9",
      },
    },
  },
  plugins: [],
} satisfies Config;
