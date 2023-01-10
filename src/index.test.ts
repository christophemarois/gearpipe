import { test, expect } from 'vitest'
import { gearpipe } from '.'
import { mapLimit, delay } from 'modern-async'

test('empty pipelines succeed', async () => {
  expect(gearpipe().sync()).toBe(undefined)
  expect(await gearpipe().async()).toBe(undefined)
})

test('pipelines succeeds without initial value', async () => {
  expect(
    gearpipe()
      .do(() => 1)
      .sync(),
  ).toBe(1)
  expect(
    await gearpipe()
      .do(() => 1)
      .async(),
  ).toBe(1)
})

test('well-formed sync pipeline succeeds', () => {
  const out = gearpipe([1, 2, 3])
    .do((nums) => nums.map((x) => x * 2).join(','))
    .do((str) => str.split(',').map((x) => parseInt(x) * 2))
    .sync()

  expect(out).toEqual([4, 8, 12])
})

test('well-formed async pipeline succeeds', async () => {
  const out = await gearpipe([1, 6, 3, 4, 5, 2])
    .do((nums) =>
      mapLimit(
        nums,
        async (n) => {
          await delay()
          return n
        },
        3,
      ),
    )
    .do((nums) =>
      nums
        .filter((n) => n % 2 === 0)
        .map((n) => n * 2)
        .sort((a, b) => a - b),
    )
    .async()

  return expect(out).toEqual([4, 8, 12])
})

test('badly-formed sync pipeline throws', () => {
  expect(() => {
    return gearpipe([1, 2, 3])
      .do((nums) => nums.map((x) => x * 2).join(','))
      .do(async (str) => str.split(',').map((x) => parseInt(x) * 2))
      .sync()
  }).toThrow()
})
