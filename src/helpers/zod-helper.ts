import * as z from "zod";

/**
 * Maps each key of T to a Zod schema typed to its exact value type.
 * Enforces that all keys of T are present while accepting any valid Zod type
 * (ZodString, ZodOptional, ZodDefault, ZodObject, ZodEnum, etc.) for each field.
 *
 * Also accepts ZodType<Exclude<T[K], undefined>> so that a ZodEnum (which
 * does not output undefined) can be used for an optional field when a default
 * will be supplied via the `defaults` argument.
 */
export type TypeToZod<T> = {
  [K in keyof T]: z.ZodType<T[K]> | z.ZodType<Exclude<T[K], undefined>>;
};

/**
 * Creates a z.object() schema constrained to the keys of T.
 *
 * The second generic S captures the exact Zod shape so TypeScript infers
 * precise output types (z.string() → string, z.optional(...) → T | undefined)
 * rather than falling back to unknown.
 *
 * When `defaults` is provided, each matching field schema is wrapped with
 * `.default(value)` automatically.
 *
 * @param obj Zod shape object where each key must be a valid Zod schema for the corresponding field of T.
 * @param defaults Optional default values applied per field when the input is missing that key.
 * @returns A `z.object()` schema typed to the shape S.
 */
export const createZodObject = <T, S extends TypeToZod<T> = TypeToZod<T>>(
  obj: S,
  defaults?: Partial<T>,
) => {
  if (!defaults) return z.object(obj);

  // Per-key helper: binds K so the schema and value types are correlated.
  // Casts through Exclude<T[K], undefined> so that raw ZodEnum schemas
  // (which strip undefined from their output) are handled correctly.
  function schemaForKey<K extends keyof T>(key: K): z.ZodType<T[K]> {
    const schema = obj[key] as z.ZodType<Exclude<T[K], undefined>>;
    const val = defaults![key];
    return val !== undefined
      ? (schema.default(val as unknown as never) as z.ZodType<T[K]>)
      : (schema as z.ZodType<T[K]>);
  }

  const withDefaults = (Object.keys(obj) as Array<keyof T>).reduce<
    TypeToZod<T>
  >((acc, key) => {
    acc[key] = schemaForKey(key);
    return acc;
  }, {} as TypeToZod<T>) as S;

  return z.object(withDefaults);
};
