export const BytesToInt = (number: Uint8Array, bytes: number): number => {
  let result = 0;

  for (let i = 0; i < bytes; i++) {
    result += number[i] << (i * 8);
  }

  return result;
}