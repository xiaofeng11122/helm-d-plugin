import type { Context } from '@deepseek-ai/cordis';
export interface SecurityToolMeta {
    name: string;
    category: string;
    description: string;
    example: string;
}
export declare const HELMD_TOOL_CATALOG: SecurityToolMeta[];
export declare const name = "helmd-command-hcot";
/** The host command service is required. */
export declare const inject: string[];
export declare function apply(ctx: Context): void;
