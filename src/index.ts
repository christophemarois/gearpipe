export function gearpipe<InitialValue>(initialValue?: InitialValue) {
  let fns: Array<(val: any) => any> = []

  function step<CurrentValue>(currentValue: CurrentValue) {
    return {
      do<NextValue>(fn: (val: CurrentValue) => NextValue) {
        fns.push(fn)
        return step<Awaited<NextValue>>(currentValue as Awaited<NextValue>)
      },
      async async(): Promise<CurrentValue> {
        let out: any = await initialValue

        for (const fn of fns) {
          out = await fn(out)
        }

        return out as CurrentValue
      },
      sync(): CurrentValue {
        let out: any = initialValue

        for (const fn of fns) {
          out = fn(out)

          if (typeof out?.then === 'function') {
            throw new Error(
              `Chain step returned a Promise. Use .async() instead of .sync()`,
            )
          }
        }

        return out as CurrentValue
      },
    }
  }

  return step(initialValue as Awaited<InitialValue>)
}

export default gearpipe
