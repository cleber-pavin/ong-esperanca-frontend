import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const raizProjeto = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    root: raizProjeto,
    base: "./",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                raiz: resolve(raizProjeto, "index.html"),
                inicio: resolve(raizProjeto, "html/index.html"),
                projetos: resolve(raizProjeto, "html/projetos.html"),
                cadastro: resolve(raizProjeto, "html/cadastro.html")
            }
        }
    }
});
