# TypeScript idioms

Collection of promoted TypeScript patterns with concrete examples, inspired from these playlists:

- https://www.youtube.com/playlist?list=PLIvujZeVDLMx040-j1W4WFs1BxuTGdI_b
- https://www.youtube.com/playlist?list=PLYvdvJlnTOjF6aJsWWAt7kZRJvzw-en8B

- [TypeScript idioms](#typescript-idioms)
  - [:bulb: Reuse previous type to force next type shape](#bulb-reuse-previous-type-to-force-next-type-shape)
  - [:bulb: Combine litteral enums with generic string](#bulb-combine-litteral-enums-with-generic-string)
  - [:bulb: Remove item from litteral enums](#bulb-remove-item-from-litteral-enums)
  - [:bulb: Enforce string input shape](#bulb-enforce-string-input-shape)
  - [:bulb: Using Type Guard to refer non-nullable attribute](#bulb-using-type-guard-to-refer-non-nullable-attribute)

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

const aDate = getDeepValue(objExample, "d", "f"); // const aDate: Date
const aString = getDeepValue(objExample, "a", "c"); // const aString: string
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
