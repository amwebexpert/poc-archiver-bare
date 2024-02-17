# Jest Style Guide

## Purpose

The purpose of this style guide is to offer suggested best practices when writing Jest unit tests in a React framework environment

## Contributing

This style guide ultimately represents the opinions of its contributors. If you disagree with anything, or wish to add more, please create an issue or submit a pull request. Our goal is to continuously improve the guide and build consensus around it.

## Table of content

- [Jest Style Guide](#jest-style-guide)
  - [Purpose](#purpose)
  - [Contributing](#contributing)
  - [Table of content](#table-of-content)
    - [Arrange-Act-Assert](#arrange-act-assert)
      - [Why?](#why)
      - [Bad:](#bad)
      - [Better:](#better)
    - [Don't Repeat Yourself](#dont-repeat-yourself)
      - [Why?](#why-1)

### Arrange-Act-Assert

Organize your code in a way that clearly conveys the 3 A's of each unit test. One way to accomplish this is by Arranging and Acting in `before` blocks and Asserting in `it` ones.

#### Why?

- The AAA unit test pattern is well known and recommended
- Improves unit test modularity and creates opportunities to DRY things up

#### Bad:

```ts
const useContactUsActionsSpy = jest.spyOn(hookModule, 'useContactUsActions')

describe('Help Screen test suite', () => {
...
  it('should render "call us" single action', async () => {
    const action = { prependTitle: 'callUs-prependTitle', onPress: jest.fn() }
    useContactUsActionsSpy.mockReturnValue([action]) // set the hook behavior
    await renderScreen()
    expect(screen.getByText(action.prependTitle)).toBeTruthy()
  })
...
}
```

#### Better:

```ts
const useContactUsActionsSpy = jest.spyOn(hookModule, 'useContactUsActions')

describe('Help Screen test suite', () => {
...
  it('should render "call us" single action', async () => {
    // arrange
    const action = { prependTitle: 'callUs-prependTitle', onPress: jest.fn() }
    useContactUsActionsSpy.mockReturnValue([action]) // set the hook behavior

    // act
    await renderScreen()

    // assert
    expect(screen.getByText(action.prependTitle)).toBeTruthy()
  })
...
}
```

### Don't Repeat Yourself

Use small methods or shared helpers blocks to `DRY` up repeated sections and action code.

#### Why?

- Keeps test suite more concise and readable
- Changes only need to be made in one place
- Unit tests are not exempt from coding best practices
