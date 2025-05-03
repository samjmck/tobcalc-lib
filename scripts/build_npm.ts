import { build, emptyDir } from "@deno/dnt";

await emptyDir("./lib");

await build({
  entryPoints: ["./src/export.ts"],
  outDir: "./lib",
  rootTestDir: "./tests",
  importMap: "deno.json",
  typeCheck: false,
  test: false,
  shims: {
    deno: true,
  },
  package: {
    name: "tobcalc-lib",
    version: "0.0.0"
  },
});
