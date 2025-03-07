# Advent of Code

This repo exists for fun, and for my own learning.

For AOC I generally solve the problems my own way first, then I'll go back and reimplement solutions I've seen others use, to learn from their techniques and see how to do things faster/better in future.

Of course for some of the extremely hard problems I need hints to solve them in the first place! Usually I can find my own solution, though, even if it's suboptimal at first.

Here's how to use the repo:

## Running the Puzzles

```terminal
npm start YYYY_dd_part

e.g.
npm start 2023_12_1 // 2023 Day 12 Part 1
```

With sample data:

e.g. to run day 1, part A against sample data:

```terminal
npm start 2023_12_1:sample // 2023 Day 12 Part 1 with sample data
```

## Testing

`npm test` runs all tests - on the shared lib, and on each year's puzzle solutions.

`npm test 20XX` will run the tests for that specific year only.

The problem solutions are defined in JSON in the test files.

👉 After each solve, add the answer to the array in the relevant `YYYY.test.ts` file.

## Scaffolding a new year

To start solving a new year of puzzles, run `npm gen YYYY`. The puzzle starters will be created for each day, along with empty input files, and a `YYYY.test.ts` file. Adding your solutions to the array in the test file will ensure they are part of future test runs.

## Adding input data

In the relevant `YYYY/day-X` folder:

👉 Add `part_one.sample.txt` and `part_one.txt` for part 1
👉 Add `part_two.sample.txt` and `part_two.txt` for part 2
