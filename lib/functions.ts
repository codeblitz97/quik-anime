import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import chroma from 'chroma-js';

export function generateLighterHexColor(inputHex: string): string {
  const r = parseInt(inputHex.slice(1, 3), 16);
  const g = parseInt(inputHex.slice(3, 5), 16);
  const b = parseInt(inputHex.slice(5, 7), 16);

  const intensity = 30;
  const newR = Math.min(255, r + intensity);
  const newG = Math.min(255, g + intensity);
  const newB = Math.min(255, b + intensity);

  const newHex =
    '#' +
    newR.toString(16).padStart(2, '0') +
    newG.toString(16).padStart(2, '0') +
    newB.toString(16).padStart(2, '0');

  return newHex;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTextColorHex(backgroundColor: string): string {
  const isLightBackground = chroma(backgroundColor).luminance() > 0.5;
  const mixAmount = isLightBackground ? 0.15 : 0.85;

  const textColor = chroma.mix('black', 'white', mixAmount, 'rgb').hex();
  return textColor;
}

export function darkenHexColor(hex: string, percent: number) {
  percent = Math.min(100, Math.max(0, percent));

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  let darkness = percent / 100;

  r = Math.round(r * (1 - darkness));
  g = Math.round(g * (1 - darkness));
  b = Math.round(b * (1 - darkness));

  let darkenedHex = `#${((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, '0')}`;

  return darkenedHex;
}

export type LogLevel = 'Info' | 'Debug' | 'Error' | 'Success' | 'Warn';

export function log(
  level: LogLevel = 'Info',
  component?: string,
  ...message: string[]
) {
  let color = '';
  let lvl = '';

  switch (level) {
    case 'Info':
      lvl = 'info';
      color = 'color: #34a853';
      break;
    case 'Debug':
      lvl = 'debug';
      color = 'color: #4287f5';
      break;
    case 'Warn':
      lvl = 'warn';
      color = 'color: #f4b400';
      break;
    case 'Success':
      lvl = 'log';
      color = 'color: #0f9d58';
      break;
    case 'Error':
      lvl = 'error';
      color = 'color: #ea4335';
      break;
    default:
      lvl = 'log';
      color = 'color: #000000';
  }

  const componentName = component ? `[${component}]` : '';
  const logMessage = message.join(' ');

  (console[lvl as keyof Console] as Function)(
    `%c[${level}] ${componentName}: ${logMessage}`,
    `color:#ffffff; ${color}`
  );
}
