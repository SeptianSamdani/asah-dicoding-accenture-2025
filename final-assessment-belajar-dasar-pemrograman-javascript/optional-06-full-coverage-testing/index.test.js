// index.test.js
import test from "node:test";
import assert from "node:assert";
import sum from "./index.js";

test("mengembalikan jumlah untuk bilangan non-negatif", () => {
  assert.strictEqual(sum(3, 7), 10);
  assert.strictEqual(sum(0, 5), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(1.5, 2.5), 4);
});

test("mengembalikan 0 jika parameter bukan number (tipe selain 'number')", () => {
  assert.strictEqual(sum("1", 2), 0);
  assert.strictEqual(sum(1, "2"), 0);
  assert.strictEqual(sum(undefined, 2), 0);
  assert.strictEqual(sum(2, undefined), 0);
  assert.strictEqual(sum(null, 2), 0);
  assert.strictEqual(sum(2, null), 0);
  assert.strictEqual(sum({}, 2), 0);
  assert.strictEqual(sum(2, []), 0);
});

test("mengembalikan 0 jika salah satu bilangan negatif", () => {
  assert.strictEqual(sum(-1, 2), 0);
  assert.strictEqual(sum(1, -2), 0);
  assert.strictEqual(sum(-3, -4), 0);
});

test("perilaku khusus: NaN bertipe 'number' -> hasil NaN", () => {
  assert.ok(Number.isNaN(sum(NaN, 1)));
  assert.ok(Number.isNaN(sum(1, NaN)));
  assert.ok(Number.isNaN(sum(NaN, NaN)));
});