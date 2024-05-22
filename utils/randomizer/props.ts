import seedrandom from "seedrandom";

export function impactCertProps(seed: string) {
  const random = seedrandom.alea(seed);
  const patternIndex = Math.round(random() * 3);
  const color = "#" + random().toString(16).slice(2, 8);
  return {
    color,
    patternIndex,
  };
}
