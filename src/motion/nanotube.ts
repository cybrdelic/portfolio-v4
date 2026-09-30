/** Roll a graphene lattice along C = n*a1 + m*a2, then sample its bonds. */
export function nanotube(n: number, m: number, count = 32768) {
  const root3 = Math.sqrt(3);
  const cx = root3 * (n + m / 2), cy = 1.5 * m;
  const circumference = Math.hypot(cx, cy);
  const ux = cx / circumference, uy = cy / circumference;
  const radius = circumference / (2 * Math.PI);
  const atoms: number[][] = [];
  const length = 15;
  const span = n + m + 20;
  for (let i = -span; i <= span; i++) {
    for (let j = -span; j <= span; j++) {
      for (const basis of [0, 1]) {
        const x = root3 * (i + j / 2), y = 1.5 * j + basis;
        const around = x * ux + y * uy, axial = -x * uy + y * ux;
        if (around < -0.0001 || around >= circumference - 0.0001 || axial < -length / 2 || axial > length / 2) continue;
        const angle = around / radius;
        atoms.push([Math.cos(angle) * radius, axial, Math.sin(angle) * radius]);
      }
    }
  }
  const bonds: number[][][] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const d = Math.hypot(...atoms[i].map((v, axis) => v - atoms[j][axis]));
      if (d > 0.75 && d < 1.02) bonds.push([atoms[i], atoms[j]]);
    }
  }
  const points = new Float32Array(count * 3);
  const scale = 3.7 / length;
  for (let i = 0; i < count; i++) {
    const bond = bonds[i % bonds.length];
    const t = ((i * 0.61803398875) % 1);
    for (let axis = 0; axis < 3; axis++) points[i * 3 + axis] = (bond[0][axis] * (1 - t) + bond[1][axis] * t) * scale;
  }
  return points;
}
