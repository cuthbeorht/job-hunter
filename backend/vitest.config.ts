import { configDefaults, defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, "dist", "node_modules"],
    },
    plugins: [tsConfigPaths()],
});