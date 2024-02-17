// -----------------------------------------------------
// Complicate way to make an object readonly recursively
// -----------------------------------------------------
export type DeepReadonly<T> = T extends Function ? T : DeepReadonlyArrayOrObject<T>;

export type DeepReadonlyArrayOrObject<TArrayOrObject> = TArrayOrObject extends Array<infer TElement>
  ? DeepReadonlyArray<TElement>
  : DeepReadonlyObject<TArrayOrObject>;

export type DeepReadonlyArray<TElement> = Readonly<Array<DeepReadonly<TElement>>>;

export type DeepReadonlyObject<TObject> = {
  readonly [Key in keyof TObject]: DeepReadonly<TObject[Key]>;
};

const CONFIGS2 = {
  title: "Circle K",
  key: "circleK",
  elements: [1, 2, 3],
};
export let PUBLIC_CONFIGS: DeepReadonly<typeof CONFIGS2> = CONFIGS2;

PUBLIC_CONFIGS.elements.forEach(console.info); // 1 2 3
// PUBLIC_CONFIGS.elements = []; // Cannot assign to 'elements' because it is a read-only property.ts(2540)
// PUBLIC_CONFIGS.elements.push(4); // Property 'push' does not exist on type 'readonly number[]'.ts(2339)
// PUBLIC_CONFIGS.title = "7 Eleven"; // Cannot assign to 'title' because it is a read-only property.ts(2540)

// -----------------------------------------------------
// EASY way to make an object readonly recursively!!!
// -----------------------------------------------------
const CONFIGS = {
  title: "Circle K",
  key: "circleK",
  elements: [1, 2, 3],
} as const; // EASY WAY TO MAKE AN OBJECT READONLY!!!

CONFIGS.elements.forEach(console.info); // 1 2 3
// CONFIGS.elements = [] // Cannot assign to 'elements' because it is a read-only property.ts(2540)
// CONFIGS.elements.push(4); // Property 'push' does not exist on type 'readonly number[]'.ts(2339)
// CONFIGS.title = "7 Eleven"; // Cannot assign to 'title' because it is a read-only property.ts(2540)
