export const formatWithLeadingZero = (n: number) => (n < 10 ? '0'.concat(n.toString()) : n.toString());
