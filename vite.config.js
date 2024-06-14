import { defineConfig } from "vite";

const config = defineConfig({
    base: "/drawing-js/",
    build: {
        outDir: "docs",
    }
});

export default config;