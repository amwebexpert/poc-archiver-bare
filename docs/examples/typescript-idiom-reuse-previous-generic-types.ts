export const getDeepValue = <T, TKey extends keyof T, TSecondKey extends keyof T[TKey]>(
  obj: T,
  key: TKey,
  subkey: TSecondKey,
): T[TKey][TSecondKey] => {
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
