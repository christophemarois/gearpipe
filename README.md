# ⚙️ Gearpipe

![npm](https://img.shields.io/npm/v/react?style=flat-square) ![bundlephobia](https://img.shields.io/bundlephobia/minzip/react?style=flat-square)

Gearpipe is a TS/JS utility that allows you to write **sync and async** functional pipelines in a very readable manner, similar to the [ES Pipeline Operator Proposal](https://github.com/tc39/proposal-pipeline-operator).

Install `gearpipe` from npm

### Features

- Tiny (403B), universal build, no dependencies.
- Async or sync pipelines with **correct type inference**. Even if pipeline is async, type inference considers it as sync for better DX.
- Composable and lazy-executing.
- Pairs well with sync/async toolbelts like lodash, rambda, modern-async, etc.

### Sync example

Ended with the `.sync()` method, gearpipe acts a lot like other pipeline utilites like lodash's `_.chain()`

```ts
import { gearpipe } from 'gearpipe'

function uselesslyComplexOperation(nums: number[]) {
  return gearpipe(nums)
    .do((/** number[] */ nums) => nums.map((x) => x * 2).join(','))
    .do((/** string */ str) => str.split(',').map((x) => parseInt(x) * 2))
    .sync()
}

uselesslyComplexOperation([1, 2, 3]) //=> [4, 8, 12]
```

### Async example

Ened with the `.async()` method, gearpipe becomes really useful.

Let's fetch a hypothetical user api with limited concurrency, then sort the results with lodash.

```ts
import { gearpipe } from 'gearpipe'
import { mapLimit } from 'modern-async'
import { sortBy } from 'lodash'

type User = {
  age: number
}

async function getUser(id: string): Promise<User> {
  return await fetch(`/users/${id}/`).then((resp) => resp.json())
}

async function getUsersByAge(ids: string[]): Promise<User[]> {
  return await gearpipe(ids)
    .do((/** string[] */ ids) => mapLimit(ids, getUser, 3))>
    .do((/** User[] */ users) => sortBy(users, (x) => x.age))
    .async()
}
```

Notice that the `sortBy` step receives an awaited `users` variable. The two pipeline steps, one async and one sync, both read synchronously.
