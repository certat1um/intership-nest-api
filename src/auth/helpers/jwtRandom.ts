export const jwtRandom = (): string => {
  return (Math.random() * 999999999999999999).toString();
};
