const isString = <T = any>(value: T | string): value is string => {
  return typeof value === "string";
};

const isNumber = <T = any>(value: T | number): value is number => {
  return typeof value === "number";
};

const isBoolean = <T = any>(value: T | boolean): value is boolean => {
  return typeof value === "boolean";
};

const isObject = <T = any>(value: T | object): value is object => {
  return typeof value === "object";
};

const isBigInt = <T = any>(value: T | bigint): value is bigint => {
  return typeof value === "bigint";
};

const isDate = <T = any>(value: T | Date): value is Date => value instanceof Date;

describe("Demo", () => {
  describe("isDate", () => {
    it("should work", () => {
      // arrage
      const value = new Date();

      // act
      const result = isDate(value);

      // act / assert
      expect(isDate(value)).toBe(true);
      expect(isDate("value")).toBe(false);
      expect(isDate(true)).toBe(false);
    });
  });

  describe("isString", () => {
    it("should work", () => {
      const value: unknown = "Hello";
      if (isString(value)) {
        //console.log(value.toUpperCase()); // const value: string
      } else {
        //console.log("Not a string", value);
      }

      // arrange
      const obj = { name: "John" };
      const isSuccess = true;
      const total = 1000;
      const now = new Date();
      const message = "Hello World";

      // act / assert
      expect(isString(obj)).toBe(false);
      expect(isString(isSuccess)).toBe(false);
      expect(isString(total)).toBe(false);
      expect(isString(now)).toBe(false);
      expect(isString(message)).toBe(true);
    });
  });
});
