type SemanticVersion = `v${number}.${number}.${number}`;

export const getPatch = (version: SemanticVersion) => {
  const [, , patch] = version.split(".");
  return Number(patch);
};

describe("Demo", () => {
  it("should work", () => {
    // arrange
    const version: SemanticVersion = "v1.2.3";

    // act
    const result = getPatch(version);

    // assert
    expect(result).toBe(3);
  });
});
