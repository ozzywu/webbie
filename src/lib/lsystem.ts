export interface Point {
  x: number;
  y: number;
}

export interface Branch {
  start: Point;
  end: Point;
  depth: number;
}

/**
 * Generate an L-system string by applying production rules iteratively.
 */
export function generateString(
  axiom: string,
  rules: Record<string, string>,
  iterations: number
): string {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of current) {
      next += rules[char] ?? char;
    }
    current = next;
  }
  return current;
}

/**
 * Simple seeded PRNG for deterministic "random" variation.
 */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Interpret an L-system string using turtle graphics.
 * Returns an array of branch segments with positions and depth info.
 */
export function interpret(
  str: string,
  config: {
    stepLength: number;
    angleDelta: number; // radians
    lengthDecay?: number; // multiply step length on each [ push
    angleJitter?: number; // random angle variation (0-1 range, 0.1 = ±10%)
    seed?: number;
  }
): Branch[] {
  const branches: Branch[] = [];
  const stack: {
    x: number;
    y: number;
    angle: number;
    depth: number;
    step: number;
  }[] = [];

  const rng = createRng(config.seed ?? 42);
  const jitter = config.angleJitter ?? 0.1;
  const decay = config.lengthDecay ?? 0.85;

  let x = 0;
  let y = 0;
  let angle = Math.PI / 2; // pointing up
  let depth = 0;
  let step = config.stepLength;

  for (const char of str) {
    switch (char) {
      case "F": {
        const nx = x + Math.cos(angle) * step;
        const ny = y + Math.sin(angle) * step;
        branches.push({ start: { x, y }, end: { x: nx, y: ny }, depth });
        x = nx;
        y = ny;
        break;
      }
      case "+":
        angle += config.angleDelta * (1 - jitter + rng() * jitter * 2);
        break;
      case "-":
        angle -= config.angleDelta * (1 - jitter + rng() * jitter * 2);
        break;
      case "[":
        stack.push({ x, y, angle, depth, step });
        depth++;
        step *= decay;
        break;
      case "]": {
        const state = stack.pop();
        if (state) {
          x = state.x;
          y = state.y;
          angle = state.angle;
          depth = state.depth;
          step = state.step;
        }
        break;
      }
      // 'X' and other symbols are ignored during interpretation
    }
  }

  return branches;
}

/**
 * Calculate bounding box of branches.
 */
export function getBounds(branches: Branch[]) {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const b of branches) {
    minX = Math.min(minX, b.start.x, b.end.x);
    maxX = Math.max(maxX, b.start.x, b.end.x);
    minY = Math.min(minY, b.start.y, b.end.y);
    maxY = Math.max(maxY, b.start.y, b.end.y);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
