# TypeScript idioms

Collection of promoted TypeScript patterns with concrete examples, inspired from these playlists:

- [Advanced TypeScript - Matt Pockok](https://www.youtube.com/playlist?list=PLIvujZeVDLMx040-j1W4WFs1BxuTGdI_b)
- [Advanced TypeScript Tutorials - Basarat](https://www.youtube.com/playlist?list=PLYvdvJlnTOjF6aJsWWAt7kZRJvzw-en8B)

Table of content

- [TypeScript idioms](#typescript-idioms)
  - [:bulb: Reuse previous type to force next type shape](#bulb-reuse-previous-type-to-force-next-type-shape)
  - [:bulb: Combine litteral enums with generic string](#bulb-combine-litteral-enums-with-generic-string)
  - [:bulb: Remove item from litteral enums](#bulb-remove-item-from-litteral-enums)
  - [:bulb: Enforce string input shape](#bulb-enforce-string-input-shape)
  - [:bulb: Using Type Guard to refer non-nullable attribute](#bulb-using-type-guard-to-refer-non-nullable-attribute)
  - [:bulb: Using Type Guard as utilities](#bulb-using-type-guard-as-utilities)
  - [:bulb: Infer React Component props](#bulb-infer-react-component-props)
  - [:bulb: Deep Partial type](#bulb-deep-partial-type)
  - [:bulb: Deep Readonly type](#bulb-deep-readonly-type)
  - [:bulb: Remove union member](#bulb-remove-union-member)
  - [:bulb: Usage of `Omit<P, K>` for attribute removal transformer function pattern](#bulb-usage-of-omitp-k-for-attribute-removal-transformer-function-pattern)
  - [:bulb: Pure TS function inputs validation](#bulb-pure-ts-function-inputs-validation)

## :bulb: Reuse previous type to force next type shape

```typescript
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

const theDate = getDeepValue(objExample, "d", "f"); // const theDate: Date
const theString = getDeepValue(objExample, "a", "c"); // const theString: string
```

## :bulb: Combine litteral enums with generic string

```typescript
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

type IconSize = "sm" | "md" | "lg" | "xl";

// equivalent to string since all items of IconSize are string
type ExtendedIconSizeWrongWayLoosingAutoComplete = IconSize | string;

type ExtendedIconSize = IconSize | Omit<string, IconSize>;
type LooseAutoComplete<T extends string> = T | Omit<string, T>;

interface IMySuperComponentProps {
  size: ExtendedIconSize;
  size2?: LooseAutoComplete<IconSize>;
  sizeWithoutAutoComplete?: ExtendedIconSizeWrongWayLoosingAutoComplete;
}

const MySuperComponent: FunctionComponent<IMySuperComponentProps> = ({ size }) => {
  return <View>{size}</View>;
};

export const App: FunctionComponent = ({}) => {
  return (
    <View>
      <MySuperComponent size="sm" size2="sm" sizeWithoutAutoComplete="no-ide-auto-completion" />
      <MySuperComponent size="md" size2="md" sizeWithoutAutoComplete="no intellisence since that prop is a string" />
      <MySuperComponent size="freeValue" />
    </View>
  );
};
```

## :bulb: Remove item from litteral enums

```typescript
type UserRole = "admin" | "user" | "visitor" | "guest";

// The easiest way to remove a litteral item from a union type is to use the Exclude<T, U> utility type.
type NonAdminRole = Exclude<UserRole, "admin">;

// Another way is to use a conditional type.
type RemoveAdmin<T> = T extends "admin" ? never : T;
type RemoveAdmin2<T extends UserRole, E> = T extends E ? never : T; // (similar to what Exclude is doing)

describe("Demo", () => {
  it("should work", () => {
    // arrange
    const user: NonAdminRole = "user";
    const user2: RemoveAdmin<UserRole> = "guest";
    const user3: RemoveAdmin2<UserRole, "admin"> = "visitor";

    // assert
    expect(user).toBe("user");
    expect(user2).toBe("guest");
    expect(user3).toBe("visitor");
  });
});
```

## :bulb: Enforce string input shape

```typescript
type SemanticVersion = `v${number}.${number}.${number}`;

export const getPatch = (version: SemanticVersion) => {
  const [, , patch] = version.split(".");
  return Number(patch);
};

describe("Enforce string input shape", () => {
  it("should work", () => {
    // arrange
    const version: SemanticVersion = "v1.2.3";

    // act
    const result = getPatch(version);

    // assert
    expect(result).toBe(3);
  });
});
```

## :bulb: Using Type Guard to refer non-nullable attribute

```typescript
type ProductStats = {
  salesPerMonth: number;
  deliveredPerMonth: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  stats?: ProductStats[];
};

type SafeSProductStats = Omit<Product, "stats"> & {
  stats: NonNullable<ProductStats[]>;
};

// instead of returning a regular `boolean` we return `product is SafeSProductStats` (type guard)
export const hasStats = (product?: Product):  => !!product?.stats?.length;

const monthlyStatsSorter = (a: ProductStats, b: ProductStats) => a.salesPerMonth - b.salesPerMonth;

export const getProductMonthlyStats = (product?: Product): ProductStats[] => {
  if (!hasStats(product)) {
    return [];
  }

  // here product is narrowed to SafeSProductStats
  return [...product.stats].sort(monthlyStatsSorter);
};
```

## :bulb: Using Type Guard as utilities

```typescript
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
```

## :bulb: Infer React Component props

```typescript
import { FunctionComponent } from "react";

type Props = {
  rowValue: number;
  rowReverseValue?: number;
  isReverseVisible?: boolean;
};

export const AppProgressBar: FunctionComponent<Props> = ({ rowValue, rowReverseValue, isReverseVisible }) => {
  console.info("====>>> info", { rowValue, rowReverseValue, isReverseVisible });
  return null;
};

// -------------------------
// elsewhere in the codebase...

type PropsFrom<TComponent> = TComponent extends FunctionComponent<infer P> ? P : never;

const myProps: PropsFrom<typeof AppProgressBar> = {
  rowValue: 1,
  rowReverseValue: 2,
  isReverseVisible: true,
};

// so usefull that React has a built-in type for this
const myProps2: ComponentPropsWithoutRef<typeof AppProgressBar> = {
  rowValue: 1,
  rowReverseValue: 2,
  isReverseVisible: true,
};
```

## :bulb: Deep Partial type

```typescript
export type DeepPartial<T> = T extends Function ? T : DeepPartialArrayOrObject<T>;

export type DeepPartialArrayOrObject<TArrayOrObject> = TArrayOrObject extends Array<infer TElement>
  ? DeepPartialArray<TElement>
  : DeepPartialObject<TArrayOrObject>;

export type DeepPartialArray<TElement> = Array<DeepPartial<TElement>>;

export type DeepPartialObject<TObject> = {
  [Key in keyof TObject]?: DeepPartial<TObject[Key]>;
};

// -------------------------
// elsewhere in the codebase...

type ConfigsType = {
  title: string;
  key: string;
  subConfigs: {
    title: string;
    key: string;
  };
};

export const fullConfigs: ConfigsType = {
  title: "my-title",
  key: "my-key",
  subConfigs: {
    title: "my-sub-title",
    key: "my-sub-key", // try to comment key: Property 'key' is required in type '{ title: string; key: string; }'
  },
};

export const partialConfigs: DeepPartial<ConfigsType> = {
  key: "my-key",
  subConfigs: {
    title: "my-sub-title",
  },
};
```

## :bulb: Deep Readonly type

```typescript
// -----------------------------------------------------
// Complicate way to make an object readonly recursively (just a demo don't do that)
// -----------------------------------------------------
export type DeepReadonly<T> = T extends Function ? T : DeepReadonlyArrayOrObject<T>;

export type DeepReadonlyArrayOrObject<TArrayOrObject> = TArrayOrObject extends Array<infer TElement>
  ? DeepReadonlyArray<TElement>
  : DeepReadonlyObject<TArrayOrObject>;

export type DeepReadonlyArray<TElement> = Readonly<Array<DeepReadonly<TElement>>>;

export type DeepReadonlyObject<TObject> = {
  readonly [Key in keyof TObject]: DeepReadonly<TObject[Key]>;
};

// -------------------------
// elsewhere in the codebase...

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
} as const; // <<<===== EASY WAY TO MAKE AN OBJECT READONLY!!!

CONFIGS.elements.forEach(console.info); // 1 2 3
// CONFIGS.elements = [] // Cannot assign to 'elements' because it is a read-only property.ts(2540)
// CONFIGS.elements.push(4); // Property 'push' does not exist on type 'readonly number[]'.ts(2339)
// CONFIGS.title = "7 Eleven"; // Cannot assign to 'title' because it is a read-only property.ts(2540)
```

## :bulb: Remove union member

```typescript
type TPlanets = "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";
type TPlanetsButEarth = Exclude<TPlanets, "earth">; // "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"

type TRemoveEarth<TName> = TName extends "earth" ? never : TName;
type TPlanetsButEarthV2 = TRemoveEarth<TPlanets>; // "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"
```

## :bulb: Usage of `Omit<P, K>` for attribute removal transformer function pattern

```typescript
// -----------------------------------------------------
// Explicit and specific version
// -----------------------------------------------------
type WithTimestamp = { timestamp?: string };

export const withoutTimestamp = <TObj extends WithTimestamp>(object: TObj): Omit<TObj, "timestamp"> => {
  const { timestamp: _, ...rest } = object;
  return rest;
};

// -----------------------------------------------------
// More generic better version
// -----------------------------------------------------
export const keyRemover = <TObj extends Record<string, any>, TObjKey extends keyof TObj>(
  object: TObj,
  keys: TObjKey[],
): Omit<TObj, TObjKey> => {
  const newObject = { ...object };
  keys.forEach(key => delete newObject[key]);

  return newObject;
};

const myObject = {
  a: 1,
  b: 2,
  c: 3,
};

const result = keyRemover(myObject, ["a", "c"]);
console.info("====>>> info", result.b);
// result.a // Property 'a' does not exist on type 'Omit<{ a: number; b: number; c: number; }, "a" | "c">'
```

## :bulb: Pure TS function inputs validation

```typescript
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
```
