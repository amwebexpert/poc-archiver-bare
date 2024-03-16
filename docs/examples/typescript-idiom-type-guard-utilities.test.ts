const isString = <T = any>(value: T | string): value is string => {
  return typeof value === "string";
};

describe("Demo", () => {
  it("should work", () => {
    const value: unknown = "Hello";
    if (isString(value)) {
      console.log(value.toUpperCase()); // const value: string
    } else {
      console.log("Not a string", value);
    }

    // arrange
    const obj = { name: "John" };
    const isSuccess = true;
    const total = 1000;
    const now = new Date();
    const message = "Hello World";

    // assert
    expect(isString(obj)).toBe(false);
    expect(isString(isSuccess)).toBe(false);
    expect(isString(total)).toBe(false);
    expect(isString(now)).toBe(false);
    expect(isString(message)).toBe(true);
  });
});
