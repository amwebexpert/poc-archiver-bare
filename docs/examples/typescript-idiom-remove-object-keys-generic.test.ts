export const keyRemover = <TObj extends Record<string, any>, TObjKey extends keyof TObj>(
  object: TObj,
  keys: TObjKey[],
): Omit<TObj, TObjKey> => {
  const newObject = { ...object };
  keys.forEach(key => delete newObject[key]);

  return newObject;
};

describe("Demo", () => {
  it("should work", () => {
    // arrange
    const myObject = {
      a: 1,
      b: 2,
      c: 3,
    };
    expect(JSON.stringify(myObject)).toBe('{"a":1,"b":2,"c":3}');

    // act
    const result = keyRemover(myObject, ["a", "c"]);

    // assert
    expect(result.b).toBe(2);
    expect(JSON.stringify(result)).toBe('{"b":2}');
  });
});
