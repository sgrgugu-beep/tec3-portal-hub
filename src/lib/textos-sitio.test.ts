import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parrafos, textosPorDefecto } from "./textos-sitio";
describe("textos del sitio", () => {
  it("separa párrafos por línea en blanco", () => { assert.deepEqual(parrafos("Uno\n\nDos"), ["Uno", "Dos"]); });
  it("tiene respaldo para la historia institucional", () => { assert.ok(textosPorDefecto["texto.institucional.historia_texto"]?.includes("cinco décadas")); });
});
