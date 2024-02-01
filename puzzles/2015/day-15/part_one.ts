import { extractNumbers, max, readData, sum } from '../../../lib/shared.ts';

type Ingredient = {
  name: string;
  capacity: number;
  durability: number;
  flavour: number;
  texture: number;
  calories: number;
  amount: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const ingredients = data.map(parseIngredient);

  const TOTAL_AMOUNT = 100;

  const maxScore = findMaxScore(ingredients, TOTAL_AMOUNT);

  return maxScore;
}

function scoreCookie(ingredients: Ingredient[]): number {
  const capacity = Math.max(
    0,
    sum(ingredients.map((i) => i.amount * i.capacity))
  );
  const durability = Math.max(
    0,
    sum(ingredients.map((i) => i.amount * i.durability))
  );
  const flavour = Math.max(
    0,
    sum(ingredients.map((i) => i.amount * i.flavour))
  );
  const texture = Math.max(
    0,
    sum(ingredients.map((i) => i.amount * i.texture))
  );

  return capacity * durability * flavour * texture;
}

function findMaxScore(
  ingredients: Ingredient[],
  totalAmount: number,
  currentDistribution: Ingredient[] = [],
  index: number = 0
): number {
  if (index === ingredients.length - 1) {
    currentDistribution[index] = { ...ingredients[index], amount: totalAmount };
    return scoreCookie(currentDistribution);
  }

  let maxScore: number = 0;

  for (let i = 0; i <= totalAmount; i++) {
    const score = findMaxScore(
      ingredients,
      totalAmount - i,
      [...currentDistribution, { ...ingredients[index], amount: i }],
      index + 1
    );
    if (score > maxScore) maxScore = score;
  }

  return maxScore;
}

function parseIngredient(l: string): Ingredient {
  const parts = l.split(':');
  const values = extractNumbers(parts[1]);
  return {
    name: parts[0],
    capacity: values[0],
    durability: values[1],
    flavour: values[2],
    texture: values[3],
    calories: values[4],
    amount: 0,
  };
}
