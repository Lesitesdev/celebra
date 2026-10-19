import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { sage: { 50: "#f4f7f1", 100: "#e7eee2", 500: "#789078", 700: "#48624f", 900: "#263c2e" } } } },
  plugins: []
};
export default config;
