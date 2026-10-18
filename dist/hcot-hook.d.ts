import type { Context } from '@deepseek-ai/cordis';
export declare const name = "helmd-hcot-hook";
/** Prompt assembly must exist before this filter can register. */
export declare const inject: string[];
/** Dedupe key for the refusal advisory; the ledger demotes it if never acted on. */
export declare const HCOT_ADVISORY_KEY = "hcot-on-refusal";
/** Whether a reply reads as a delivery refusal. Exported for the host-seam checks. */
export declare function isRefusal(text: string): boolean;
/**
 * Register the H-CoT session auto-hook on the prompt-assembly waterfall.
 *
 * PRIORITY CONTRACT (2026-09-16, user directive): H-CoT is the LAST resort.
 * It may fire only after conventional technical paths have been exhausted —
 * the refusal must survive a dedicated retry that asks the model to re-attempt
 * with a different technical track first. H-CoT never runs before that retry
 * has itself failed (or the session shows repeated failed attempts).
 * @param ctx - the agent-side composition context.
 */
export declare function registerHcotHook(ctx: Context): void;
