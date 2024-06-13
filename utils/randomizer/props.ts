import seedrandom from "seedrandom";

export function impactCertProps(seed: string) {
  const random = seedrandom.alea(seed);
  console.log(seed);
  const patternIndex = Math.round(random() * 3);
  const colorIndex = Math.round(random() * 11);
  console.log("Pattern index U: ", patternIndex);
  console.log("Color index U: ", colorIndex);

  return {
    patternIndex,
    colorIndex,
  };
}
