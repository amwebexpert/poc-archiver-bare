export const getDeepValue = <T, K extends keyof T, L extends keyof T[K]>(obj: T, key: K, subkey: L): T[K][L] => {
  return obj[key][subkey];
};

const objExample = {
  a: {
    b: 1,
    c: "hello",
  },
  d: {
    e: true,
    f: new Date(),
  },
};

const aDate = getDeepValue(objExample, "d", "f"); // const aDate: Date
const aString = getDeepValue(objExample, "a", "c"); // const aString: string
