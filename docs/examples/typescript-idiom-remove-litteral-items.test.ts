type UserRole = "admin" | "user" | "visitor" | "guest";

// The easiest way to remove a litteral item from a union type is to use the Exclude<T, U> utility type.
type NonAdminRole = Exclude<UserRole, "admin">;

// Another way is to use a conditional type.
type RemoveAdmin<T> = T extends "admin" ? never : T;
type RemoveAdmin2<T extends UserRole, E> = T extends E ? never : T;

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
