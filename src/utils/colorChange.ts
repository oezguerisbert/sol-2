export const colorChange = (color: string, change: number) =>
  color
    .split('-')[0]
    .concat('-'.concat(Math.max(0, Math.min(parseInt(color.split('-')[1], 10) + change, 900)).toString()));
