// index.test.js
import test from "node:test";
import assert from "node:assert";

import { sum } from "./index.js";

test("sum function should return the correct result", () => {
  // case 1: bilangan positif
  assert.strictEqual(sum(2, 3), 5);

  // case 2: bilangan negatif
  assert.strictEqual(sum(-2, -3), -5);

  // case 3: kombinasi positif dan negatif
  assert.strictEqual(sum(-2, 5), 3);

  // case 4: salah satu angka 0
  assert.strictEqual(sum(0, 7), 7);
});