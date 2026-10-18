/** Delivery-refusal marker set (same narrowing rule as hcot-hook REFUSAL_RE). */
export declare const REFUSAL_RE: RegExp;
/** H-CoT variant corpus (data, not code). */
export interface Variant {
    id: string;
    probe: string;
    forge: string;
    inject: string;
}
/** One reference instance in the slot library (frames / enablers / continuations). */
export interface Instance {
    text: string;
    assumption?: string;
    evidence?: string;
    legacy?: string;
}
export interface Corpus {
    probes: Record<string, string>;
    forges: Record<string, string>;
    injects: Record<string, string>;
    variants: Variant[];
    /** Reference instances — a resource, not a closed set (see hcot-strategy.ts). */
    frames?: Record<string, Instance>;
    enablers?: Record<string, Instance>;
    continuations?: Record<string, Instance>;
}
export interface HcotSteps {
    variant: string;
    probe: string;
    forgedReasoning: string;
    injectionPayload: string;
}
export interface HcotOptions {
    goal: string;
    model?: string;
    baseUrl?: string;
    apiKey?: string;
    variant?: string;
    probe?: string;
    forgeFile?: string;
    firstChars?: number;
    temperature?: number;
    ledger?: string;
    dryRun?: boolean;
    transferProbe?: string;
    /** true = 旧三段式（probe/forge/inject 单次调用）；默认 false = 两阶段自适应。 */
    legacy?: boolean;
    /**
     * 截断恢复轮（continuation transport）：上一轮产出被截断时，把已产出的部分
     * 原样带入，指示目标从断点续写——不重启、不重新采集。设置后忽略
     * legacy/adaptive/variant 等构造路径。
     */
    continueFrom?: {
        partial: string;
        instruction?: string;
    };
    /** Strategy proposal from hcot-strategy (slots or custom); overrides `variant`. */
    strategy?: {
        frame?: string;
        enabler?: string;
        continuation?: string;
        custom?: string;
        rationale?: string;
    };
    /** Semantic auto-match: classify(model,goal) + proposeStrategy(ledger) → strategy. */
    autoStrategy?: boolean;
    /** Request/trigger profile, recorded on the ledger for per-group stats. */
    semanticType?: string;
    trigger?: string;
    /** 宿主 Cordis Context（用于解析 ctx.credentials 等）。 */
    ctx?: unknown;
}
export interface HcotRoundResult {
    variant: string;
    firstFragment: string;
    final: string;
    refused: boolean;
    firstFragmentLeaked: boolean;
    finalUsable: boolean;
    broke: boolean;
    transferCompliant: boolean | null;
}
export declare function loadCorpus(): Promise<Corpus>;
export declare function ledgerPath(opts: Partial<HcotOptions>): string;
interface LedgerRecord {
    model?: string;
    variant?: string;
    goal_len?: number;
    first_chars?: number;
    first_fragment_leaked?: boolean;
    refused_final?: boolean;
    final_usable?: boolean;
    /** 2026-09-16 起新记录用 broke（策略层/UI 消费键）；break 保留为兼容别名。 */
    broke?: boolean;
    break?: boolean;
    transfer_compliant?: boolean | null;
    score?: number;
    /** 传输/凭据失败的错误摘要（失败也记账，否则自适应学习永远冷启动）。 */
    error?: string;
    /** Per-group stats keys (model × semantic_type × trigger). */
    semantic_type?: string;
    trigger?: string;
    /** Free-form strategy actually used — slots, a variant id, or AI-invented. */
    strategy?: Record<string, unknown>;
}
export declare function loadLedger(path: string): Promise<LedgerRecord[]>;
export declare function clearLedger(path: string): Promise<void>;
export declare function deleteLedgerGroup(path: string, filter: {
    model?: string;
    semantic?: string;
    trigger?: string;
}): Promise<void>;
export interface DiscoveredModel {
    id: string;
    name?: string;
    provider: string;
    baseURL: string;
    apiKeyEnv: string;
    hasKey: boolean;
}
/**
 * 发现本地所有已配置且带有凭据的可用模型列表。
 * 三级数据源（0.1.7 迁移链）：settings.yaml（≤0.1.5，宿主会改名 .imported）
 * → ctx.settings.describe()（活配置的结构化值，权威）→ profile/home patch
 * 文件行扫（无 ctx 的 CLI 单发路径）。
 */
export declare function discoverAvailableModels(ctx?: unknown): Promise<DiscoveredModel[]>;
/**
 * 从多级数据源智能解析 LLM 凭据与端点配置：
 * 优先匹配所选 model 对应的实际 provider 和 baseUrl。
 */
export declare function resolveDefaultCredentials(opts?: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    ctx?: unknown;
}): Promise<{
    apiKey: string;
    baseUrl: string;
    model: string;
}>;
/**
 * Execute one H-CoT round: probe -> forge -> inject.
 * Returns the round result and a human-readable report.
 */
export declare function runHcotAttack(opts: HcotOptions): Promise<{
    text: string;
    result: HcotRoundResult | null;
    steps: HcotSteps | null;
}>;
/** Render the variant win-rate table (offline). */
export declare function renderStats(opts: {
    model?: string;
    ledger?: string;
}): Promise<string>;
export {};
