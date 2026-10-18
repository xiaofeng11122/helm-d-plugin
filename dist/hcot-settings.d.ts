import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Profile entry id this module's Config rides on — also the settings namespace. */
export declare const HCOT_NS = "helmd-hcot-settings";
/** One UI action request (written by the browser half, consumed by the host half). */
export interface HcotActionRequest {
    kind: 'attack' | 'dry-run' | 'refresh' | 'clear-ledger' | 'delete-ledger-group';
    goal?: string;
    sessionId?: string;
    strategy?: {
        frame?: string;
        enabler?: string;
        continuation?: string;
    };
    model?: string;
    provider?: string;
    maxRounds?: number;
    groupTarget?: {
        model?: string;
        semantic?: string;
        trigger?: string;
    };
}
export declare const HcotSettingsSchema: z<any, any, "plain">;
/**
 * The entry Config. 0.1.7's Loader hands this to the profile entry, and
 * `settings.describe(HCOT_NS)` serves it as the live form (base → user layer).
 */
export declare const Config: z<any, any, "plain">;
export interface HcotSettings {
    model: string;
    provider: string;
    maxRounds: number;
    autoSchedule: boolean;
    requestedAction: string;
}
/** The most recent attack verdict (JSON string, '' before the first run). */
export declare function getHcotLastResult(): string;
/** 一组分组战绩（模型×语义×触发点）。 */
export interface LedgerGroupRow {
    model: string;
    semantic: string;
    trigger: string;
    total: number;
    breaks: number;
    rate: number;
}
/** 聚合账本 → 结构化分组战绩（供 UI 渲染表格/卡片）。 */
export declare function ledgerGroups(records: Array<{
    model?: string;
    semantic_type?: string;
    trigger?: string;
    broke?: boolean;
    strategy?: Record<string, unknown>;
}>): LedgerGroupRow[];
/** 保留字符串形态（schema 简单）：结构化数组的 JSON。 */
export declare function summarizeLedger(records: Array<{
    model?: string;
    semantic_type?: string;
    trigger?: string;
    broke?: boolean;
    strategy?: Record<string, unknown>;
}>): string;
/** 实例库 → 结构化清单（每组列出实例名 + 实证标注）。 */
export declare function libraryIndex(corpus: {
    frames?: Record<string, {
        evidence?: string;
    }>;
    enablers?: Record<string, {
        evidence?: string;
    }>;
    continuations?: Record<string, {
        evidence?: string;
    }>;
}): string;
/** Back-compat textual summary (kept for logs/tests). */
export declare function summarizeLibrary(corpus: {
    frames?: Record<string, unknown>;
    enablers?: Record<string, unknown>;
    continuations?: Record<string, unknown>;
}): string;
/** Parse a requestedAction string into a request, or null when empty/invalid. */
export declare function parseAction(raw: string): HcotActionRequest | null;
/**
 * Wire the action consumer to the entry's config document.
 *
 * The UI writes `requestedAction` into the entry (settings plane); the
 * `settings/document-updated` event tells this host half to re-read via
 * `describe`, clear the request, and run it. Actions are chained so a second
 * request never overlaps the first.
 * @param ctx - the host composition context.
 */
export declare function registerHcotSettings(ctx: Context): void;
/** 解析真实的 LLM Provider (严禁将 subagent 的 'spawn' 传入 LLM 适配器) */
export declare function resolveTargetLlmProvider(hostCtx: Context, targetModel: string, explicitProvider?: string): Promise<string>;
/**
 * 优先在 dsh 当前会话下派生原生可继续子代理 (Continuable Subagent)。
 * 该子代理直接挂载在 dsh 宿主会话树下，用户可在 dsh 主界面/顶部子代理目录实时查看并交互。
 */
export declare function startHcotContinuableSubagent(hostCtx: Context, opts: {
    goal: string;
    parentAgent: any;
    model?: string;
    provider?: string;
    strategy?: {
        frame?: string;
    };
}): Promise<{
    ok: boolean;
    childId?: string;
    parentSessionId?: string;
    error?: string;
}>;
/** 在 dsh 宿主中创建专属独立推演会话（当找不到 live parent agent 时的回退通道）。 */
export declare function createDedicatedHcotSession(hostCtx: Context, opts: {
    goal: string;
    model?: string;
    provider?: string;
    strategy?: {
        frame?: string;
    };
    currentSessionId?: string;
}): Promise<{
    ok: boolean;
    sessionId?: string;
    error?: string;
    via?: string;
}>;
export declare const name = "helmd-hcot-settings";
/** The settings service is required. */
export declare const inject: string[];
/** Bundle-row entry (`@xiaofeng11122/helm-d/hcot-settings`). */
export declare function apply(ctx: Context): void;
