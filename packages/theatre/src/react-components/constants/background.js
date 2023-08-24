import { types } from '@theatre/core'

export const BACKGROUND = {
  position: types.compound({
    x: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
    y: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
  }),
  size: types.compound({
    width: types.number(100, {
      nudgeMultiplier: 0.5,
    }),
    height: types.number(100, {
      nudgeMultiplier: 0.5,
    }),
  }),
  scale: types.number(1, { nudgeMultiplier: 0.1 }),
  border: types.compound({
    size: types.number(0),
    color: types.rgba({ r: 0, g: 0, b: 0, a: 1 }),
    radius: types.number(0, {
      range: [0, 100],
      nudgeMultiplier: 1,
    }),
  }),
  url: types.string(''),
  opacity: types.number(1, {
    range: [0, 1],
    nudgeMultiplier: 0.05,
  }),
  visible: types.boolean(true),
  zIndex: types.stringLiteral('bottom', {
    bottom: '-10',
    0: '0',
    10: '10',
    100: '100',
    1000: '1000',
    10000: '10000',
  }),
}
