import type { Context } from '@deepseek-ai/cordis';
/** Resolve an interpreter/command through the subprocess seam, then the local PATH. */
export declare function resolveCommand(_ctx: Context, command: string): Promise<string>;
/** Validate and normalize a path stays within the allowed root. */
export declare function assertWithinRoot(absPath: string, root: string): string;
/**
 * Prefer the ctx.fs capability seam; fall back to the local Node fs
 * when the host has no provider.
 */
export declare function readTextSeam(ctx: Context, absPath: string): Promise<string>;
/**
 * Prefer the ctx.subprocess capability seam; fall back to a local Node
 * spawn when the host has no provider.
 */
export declare function runSeam(ctx: Context, argv: string[], cwd: string): Promise<string>;
/**
 * Safely look up an optional service from a Cordis context without triggering
 * the "cannot get property <name> without inject" proxy error.
 */
export declare function safeService<T = unknown>(ctx: unknown, name: string): T | undefined;
