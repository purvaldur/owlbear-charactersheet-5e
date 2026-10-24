/** A room call that may be refused; logs the refusal and resolves to the fallback instead. */
export function orDefault<T>(call: Promise<T>, fallback: T, what: string): Promise<T> {
  return call.catch((e: unknown) => {
    console.warn(`[Heroic Codex] Owlbear refused the ${what}, using a default:`, JSON.stringify(e));
    return fallback;
  });
}
