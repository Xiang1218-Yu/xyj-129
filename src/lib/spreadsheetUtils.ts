export const COL_COUNT = 20;
export const ROW_COUNT = 80;
export const CELL_WIDTH = 130;
export const CELL_HEIGHT = 24;

export function generateColLabels(count: number): string[] {
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    let col = "";
    let n = i;
    while (n >= 0) {
      col = String.fromCharCode(65 + (n % 26)) + col;
      n = Math.floor(n / 26) - 1;
    }
    labels.push(col);
  }
  return labels;
}

export function getCellKey(row: number, col: string): string {
  return `${col}${row}`;
}
