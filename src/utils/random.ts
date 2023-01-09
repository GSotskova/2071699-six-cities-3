export const generateRandomValue = (min:number, max: number, numAfterDigit = 0) =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[], countItems = 0):T[] => {
  const startPosition = generateRandomValue(0, items.length - 1 - countItems);
  const endPosition = startPosition + (countItems === 0 ? generateRandomValue(startPosition, items.length) : countItems) ;
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]):T =>
  items[generateRandomValue(0, items.length - 1)];
