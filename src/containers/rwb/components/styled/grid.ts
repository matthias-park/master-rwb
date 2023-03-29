const gridColumns = 12;

export const makeCol = (size: string | number, columns = gridColumns) => `
  flex: 0 0 ${(Number(size) / columns) * 100}%;
  max-width: ${(Number(size) / columns) * 100}%;
`;
export const makeColOffset = (size: string | number, columns = gridColumns) => {
  const num = Number(size) / columns;
  return `
  margin-left: ${!num ? '0' : num * 100}%;
`;
};
