import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day20a(dataPath?: string) {
  const data = await readData(dataPath);

  const modules: Modules = data.reduce(parseModule, new Map());

  setupModules(modules);

  const NUM_PRESSES = 1000;
  let pulseCounts: PulseCounts = [0, 0];
  for (let i = 0; i < NUM_PRESSES; i++) {
    const counts = pushButton(modules);
    pulseCounts[0] += counts[0];
    pulseCounts[1] += counts[1];
    // const output = modules.get('output');
    // if ('value' in output) {
    //   console.log(chalk.bgMagenta('Output:'), chalk.magenta(output.value));
    // }
  }

  return pulseCounts[0] * pulseCounts[1];
}

// [low, high]
type PulseCounts = [number, number];

function pushButton(modules: Modules): PulseCounts {
  // src, dest, 0 | 1
  const queue: [string, string, 0 | 1][] = [['button', 'broadcaster', 0]];

  //console.log(' \n');

  const pulseCounts: PulseCounts = [0, 0];

  while (queue.length) {
    const pulse = queue.shift();

    // console.log(pulse);
    const receivedFrom = pulse[0];
    const currentLabel = pulse[1];
    const pulseValue = pulse[2];

    if (pulseValue === 0) {
      pulseCounts[0] += 1;
    } else {
      pulseCounts[1] += 1;
    }

    const currentModule = modules.get(currentLabel);
    //console.log(`${currentLabel} - ${JSON.stringify(currentModule)}`);
    switch (currentModule.type) {
      case 'broadcaster':
        currentModule.destinations.forEach((d) =>
          queue.push(['broadcaster', d, pulseValue])
        );
        break;
      case '%':
        // flip flop does nothing on high pulse
        if (pulseValue === 0) {
          currentModule.state = currentModule.state === 0 ? 1 : 0;
          currentModule.destinations.forEach((d) =>
            queue.push([currentLabel, d, currentModule.state])
          );
        }
        break;
      case '&':
        currentModule.inputs[receivedFrom] = pulseValue;

        const pulseToSend = Object.values(currentModule.inputs).every(
          (v) => v === 1
        )
          ? 0
          : 1;

        currentModule.destinations.forEach((d) =>
          queue.push([currentLabel, d, pulseToSend])
        );

        break;
      case 'output':
        currentModule.value = pulseValue;
        break;
    }

    // console.log(`${currentLabel} - ${JSON.stringify(currentModule)}`);
  }

  return pulseCounts;
}

function setupModules(modules: Modules) {
  modules.set('rx', { type: 'output', value: 0 });
  modules.set('output', { type: 'output', value: 0 });

  for (const [label, module] of modules) {
    if (module.type === 'output') continue;

    for (const destination of module.destinations) {
      const dest = modules.get(destination);

      if (dest.type !== '&') continue;
      dest.inputs[label] = 0;
    }
  }
}

type Modules = Map<string, Module>;

type Module =
  | {
      type: 'broadcaster';
      destinations: string[];
    }
  | {
      type: '%';
      state: 0 | 1;
      destinations: string[];
    }
  | {
      type: '&';
      inputs: Record<string, 0 | 1>;
      destinations: string[];
    }
  | {
      type: 'output';
      value: 0 | 1;
    };

function parseModule(modules: Modules, input: string): Modules {
  const parts = input.split(' -> ');

  const destinations = parts[1].split(',').map((s) => s.trim());

  if (parts[0] === 'broadcaster') {
    modules.set('broadcaster', { type: 'broadcaster', destinations });
  } else if (parts[0].startsWith('%')) {
    modules.set(parts[0].replace('%', ''), {
      type: '%',
      destinations,
      state: 0,
    });
  } else {
    modules.set(parts[0].replace('&', ''), {
      type: '&',
      destinations,
      inputs: {},
    });
  }

  return modules;
}

const answer = await day20a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
