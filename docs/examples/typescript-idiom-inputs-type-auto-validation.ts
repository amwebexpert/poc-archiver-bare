type NonArrayAssert<T> = T extends any[] ? "Arrays are not supported for this method" : T;
type NonObjectAssert<T> = T extends object ? "Objects are not supported for this method" : T;

export const isEqual = <T>(
  value: NonObjectAssert<NonArrayAssert<T>>,
  other: NonObjectAssert<NonArrayAssert<T>>,
): boolean => {
  return value === other;
};

// Validates OK and return true
console.info("====>>> info", isEqual(1, 1));
console.info("====>>> info", isEqual("1", "1"));
console.info("====>>> info", isEqual(true, true));
console.info("====>>> info", isEqual(BigInt(2), BigInt("2")));

// Argument of type 'number[]' is not assignable to parameter of type "Arrays are not supported for this method"
console.info("====>>> info", isEqual([1], [2]));

// Argument of type '{ a: number; }' is not assignable to parameter of type "Objects are not supported for this method"
console.info("====>>> info", isEqual({ a: 1 }, { a: 1 }));

// Argument of type 'Date' is not assignable to parameter of type '"Objects are not supported for this method"'
console.info("====>>> info", isEqual(new Date(), new Date()));

// Argument of type 'RegExp' is not assignable to parameter of type '"Objects are not supported for this method"'
console.info("====>>> info", isEqual(/myregex/, /myregex/));
