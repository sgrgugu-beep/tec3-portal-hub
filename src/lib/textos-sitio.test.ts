import { describe, expect, it } from "vitest";
import { parrafos, textosPorDefecto } from "./textos-sitio";
describe("textos del sitio", () => {
  it("separa párrafos por línea en blanco", () => { expect(parrafos("Uno\n\nDos")).toEqual(["Uno", "Dos"]); });
  it("tiene respaldo para la historia institucional", () => { expect(textosPorDefecto["texto.institucional.historia_texto"]).toContain("cinco décadas"); });
});
