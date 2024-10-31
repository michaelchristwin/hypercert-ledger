import seedrandom from "seedrandom";

export function impactCertProps(seed: string) {
  const random = seedrandom.alea(seed);
  const patternIndex = Math.round(random() * 3);
  const colorIndex = Math.round(random() * 11);

  return {
    patternIndex,
    colorIndex,
  };
}
