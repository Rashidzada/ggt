declare module "@tailwindcss/vite" {
  import type { Plugin } from "vite";

  interface PluginOptions {
    optimize?: boolean | { minify?: boolean };
  }

  export default function tailwindcss(options?: PluginOptions): Plugin[];
}
