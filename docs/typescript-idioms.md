# TypeScript idioms

Collection of promoted TypeScript patterns with concrete examples

## 01 - Using Type Guard to refer non-nullable attribute

#### :white_check_mark: prefer

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

export const hasStats = (product?: Product): product is SafeSProductStats => !!product?.stats?.length;

const monthlyStatsSorter = (a: ProductStats, b: ProductStats) => a.salesPerMonth - b.salesPerMonth;

export const getProductMonthlyStats = (product?: Product): ProductStats[] => {
  if (!hasStats(product)) {
    return [];
  }

  // here product is narrowed to SafeSProductStats
  return [...product.stats].sort(monthlyStatsSorter);
};
```
