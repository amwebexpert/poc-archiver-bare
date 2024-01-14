# TypeScript idioms

Collection of promoted TypeScript patterns with concrete examples

- [TypeScript idioms](#typescript-idioms)
  - [:bulb: Enforce string input shape](#bulb-enforce-string-input-shape)
  - [:bulb: Using Type Guard to refer non-nullable attribute](#bulb-using-type-guard-to-refer-non-nullable-attribute)

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
