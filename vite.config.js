import { defineConfig } from "vite";

const config = defineConfig({
    base: "/",
    build: {
        outDir: "docs",
    }
});

export default config;