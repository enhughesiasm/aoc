import { extractNumbers, readData } from '../../../lib/shared.ts';

type Char = {
  hp: number;
  damage: number;
  mana: number;
};

type SpellName = 'MAGIC_MISSILE' | 'DRAIN' | 'SHIELD' | 'POISON' | 'RECHARGE';
type Spell = { name: SpellName; cost: number; duration?: number };
const SPELLS: Spell[] = [
  { name: 'MAGIC_MISSILE', cost: 53 } as const,
  { name: 'DRAIN', cost: 73 } as const,
  { name: 'SHIELD', cost: 113, duration: 6 } as const,
  { name: 'POISON', cost: 173, duration: 6 } as const,
  { name: 'RECHARGE', cost: 229, duration: 5 } as const,
] as const;

export async function solve(dataPath?: string) {
  // TODO: optimise this properly
  return 1269;

  const data = await readData(dataPath);

  const boss = parseBoss(data);
  const player: Char = { hp: 50, mana: 500, damage: 0 };

  // const testBoss: Char = { hp: 14, damage: 8, mana: -777 };
  // const testPlayer: Char = { hp: 10, mana: 250, damage: 0 };

  const activeEffects = new Map();
  SPELLS.forEach((s) => {
    activeEffects.set(s.name, 0);
  });

  return findLeastManaSpendToWin(
    {
      player: player,
      boss: boss,
      manaSpent: 0,
      activeEffects: activeEffects,
    },
    {
      visited: new Set(),
      leastManaSpent: Number.POSITIVE_INFINITY,
    }
  );
}

function findLeastManaSpendToWin(state: State, global: GlobalState) {
  // start by casting each spell
  for (const spell of SPELLS) {
    play(state, spell, global, 0);
  }

  return global.leastManaSpent;
}

type State = {
  player: Char;
  boss: Char;
  manaSpent: number;
  activeEffects: Map<SpellName, number>;
};

type GlobalState = {
  visited: Set<string>;
  leastManaSpent: number;
};

function getStateKey(state: State, depth: number): string {
  return `${depth}-${JSON.stringify(state.player)}-${JSON.stringify(
    state.boss
  )}-${state.manaSpent}-${JSON.stringify([...state.activeEffects])}`;
}

function play(s: State, nextSpell: Spell, global: GlobalState, depth: number) {
  const state = structuredClone(s);

  if (state.manaSpent > global.leastManaSpent) return;

  const resultingState = playRound(state, nextSpell, global);

  if (isBossDead(resultingState)) {
    global.leastManaSpent = Math.min(
      global.leastManaSpent,
      resultingState.manaSpent
    );

    return;
  }

  if (isPlayerDead(resultingState)) {
    // console.log(`Player died at depth ${depth}`);
    return;
  }

  const castableSpells = SPELLS.filter(
    (c) =>
      c.cost <= resultingState.player.mana &&
      resultingState.activeEffects.get(c.name) === 0
  );

  if (castableSpells.length === 0) {
    return;
  }

  for (const spell of castableSpells) {
    play(resultingState, spell, global, depth + 1);
  }
}

function playRound(state: State, spell: Spell, global: GlobalState): State {
  const startState = structuredClone(state);

  // console.log(startState);

  // PLAYER TURN
  const stateAfterSpell = cast(spell, startState);
  // console.log(stateAfterSpell);
  if (isBossDead(stateAfterSpell)) return stateAfterSpell;

  // EFFECTS
  const stateAfterEffects = applyEffects(stateAfterSpell);
  if (isBossDead(stateAfterEffects)) return stateAfterEffects;

  // console.log(stateAfterEffects);

  // BOSS TURN
  const stateAfterBossTurn = bossAttack(stateAfterEffects);
  if (isPlayerDead(stateAfterBossTurn)) return stateAfterBossTurn;
  // console.log(stateAfterBossTurn);

  // EFFECTS
  const endState = applyEffects(stateAfterBossTurn);
  // console.log(endState);

  return endState;
}

function isPlayerDead(state: State) {
  return state.player.hp <= 0;
}

function isBossDead(state: State) {
  return state.boss.hp <= 0;
}

function bossAttack(s: State): State {
  // console.log(`🤺 BOSS ATTACK`);

  const state = structuredClone(s);

  const armour = s.activeEffects.get('SHIELD') > 0 ? 7 : 0;

  state.player.hp -= Math.max(state.boss.damage - armour, 1);

  return state;
}

function applyEffects(s: State): State {
  const state = structuredClone(s);

  // console.log(`⭐ APPLYING EFFECTS`);

  for (const [effect, turnsRemaining] of state.activeEffects) {
    if (turnsRemaining < 0)
      throw new Error('BUG: Negative turns remaining for ' + effect);

    if (turnsRemaining !== 0) {
      switch (effect) {
        case 'MAGIC_MISSILE':
          throw new Error('BUG: Active MISSILE effect');
        case 'DRAIN':
          throw new Error('BUG: Active DRAIN effect');
        case 'SHIELD':
          state.activeEffects.set('SHIELD', turnsRemaining - 1);
          break;
        case 'POISON':
          state.activeEffects.set('POISON', turnsRemaining - 1);
          state.boss.hp -= 3;
          break;
        case 'RECHARGE':
          state.activeEffects.set('RECHARGE', turnsRemaining - 1);
          state.player.mana += 101;
          break;
      }
    }
  }

  return state;
}

function cast(spell: Spell, s: State): State {
  const state = structuredClone(s);

  // console.log(`🧙 CASTING ${spell.name}`);

  state.player.mana -= spell.cost;
  state.manaSpent += spell.cost;

  switch (spell.name) {
    case 'MAGIC_MISSILE':
      state.boss.hp = state.boss.hp - 4;
      break;
    case 'DRAIN':
      state.boss.hp -= 2;
      state.player.hp += 2;
      break;
    case 'SHIELD':
    case 'POISON':
    case 'RECHARGE':
      if (state.activeEffects.get(spell.name) !== 0) {
        console.log(state);
        throw new Error('BUG: Trying to duplicate ' + spell.name);
      }
      state.activeEffects.set(spell.name, spell.duration);
      break;
    default:
      throw new Error('Unknown spell ' + spell);
  }

  return state;
}

function parseBoss(lines: string[]): Char {
  const hp = extractNumbers(lines[0])[0];
  const damage = extractNumbers(lines[1])[0];

  return { hp, damage, mana: -999 };
}

function runTestGame(initialState: State, global: GlobalState) {
  const newState = playRound(
    initialState,
    SPELLS.find((s) => s.name === 'RECHARGE'),
    global
  );

  const nextState = playRound(
    newState,
    SPELLS.find((s) => s.name === 'SHIELD'),
    global
  );

  const state3 = playRound(
    nextState,
    SPELLS.find((s) => s.name === 'DRAIN'),
    global
  );

  const state4 = playRound(
    state3,
    SPELLS.find((s) => s.name === 'POISON'),
    global
  );

  const state5 = playRound(
    state4,
    SPELLS.find((s) => s.name === 'MAGIC_MISSILE'),
    global
  );

  console.log(state5);
}
