# TypeScript idioms

Collection of promoted TypeScript patterns with concrete examples

- [TypeScript idioms](#typescript-idioms)
  - [:bulb: Combine litteral enums with generic string](#bulb-combine-litteral-enums-with-generic-string)
  - [:bulb: Remove item from litteral enums](#bulb-remove-item-from-litteral-enums)
  - [:bulb: Enforce string input shape](#bulb-enforce-string-input-shape)
  - [:bulb: Using Type Guard to refer non-nullable attribute](#bulb-using-type-guard-to-refer-non-nullable-attribute)

## :bulb: Combine litteral enums with generic string

```typescript
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

type IconSize = "sm" | "md" | "lg" | "xl";

// equivalent to string since all items of IconSize are string
type ExtendedIconSizeWrongWayLoosingAutoComplete = IconSize | string;

type ExtendedIconSize = IconSize | Omit<string, IconSize>;

interface IMySuperComponentProps {
  size: ExtendedIconSize;
  size2?: ExtendedIconSizeWrongWayLoosingAutoComplete;
}

const MySuperComponent: FunctionComponent<IMySuperComponentProps> = ({ size }) => {
  return <View>{size}</View>;
};

export const App: FunctionComponent = ({}) => {
  return (
    <View>
      <MySuperComponent size="sm" size2="no-ide-auto-completion" />
      <MySuperComponent size="md" size2="no intellisence since that prop is a string" />
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
