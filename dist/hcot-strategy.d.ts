/** Every proposal carries this so no caller mistakes a reference for an order. */
export declare const STRATEGY_DISCLAIMER = "\u53C2\u8003\u5EFA\u8BAE\uFF0C\u4E0D\u662F\u7EA6\u675F\uFF1A\u53EF\u91C7\u7EB3\u3001\u53EF\u6539\u3001\u53EF\u81EA\u521B\u673A\u5236\uFF0C\u4E5F\u53EF\u5B8C\u5168\u7ED5\u8FC7\u69FD\u4F4D\u4F53\u7CFB\u3002";
/** 请求语义画像（参考）。 */
export interface RequestProfile {
    model: string;
    semanticType: 'real-third-party' | 'dangerous-op' | 'authorization-gap' | 'capability-boundary' | 'unknown';
    /** 建议攻击方向（reference，非命令）。 */
    suggestedAxis: string;
    /** 命中的信号词，便于复核这次初判。 */
    signals: string[];
    note: string;
}
/** 触发点画像（参考）。 */
export interface TriggerProfile {
    trigger: 'target-domain' | 'misuse-potential' | 'authorization' | 'boundary' | 'unknown';
    /** 建议攻击方向。 */
    suggestedAxis: string;
    signals: string[];
    note: string;
}
/** 策略建议——三个槽位都是可选：AI 可自创、可只填一两个、可全部无视。 */
export interface StrategyProposal {
    frame?: string;
    enabler?: string;
    continuation?: string;
    /** AI 自创机制的自由描述（自创时填这里，而不是硬塞进槽位）。 */
    custom?: string;
    /** 为什么这么建议。 */
    rationale: string;
    disclaimer: string;
}
/** 槽位子集——调用方（engine / 命令 / AI）只需给出这几个字段。 */
export type StrategySlots = Pick<StrategyProposal, 'frame' | 'enabler' | 'continuation' | 'custom'>;
/** 账本里一条历史战绩（只读参考；字段宽松以容纳自由形式的策略描述）。 */
export interface LedgerRecord {
    model?: string;
    semantic_type?: string;
    trigger?: string;
    strategy?: Record<string, unknown>;
    broke?: boolean;
    refused_final?: boolean;
    score?: number;
}
/**
 * 请求语义初判（模型 + 目标）。
 * 只做快速映射：判断不确定时返回 `unknown` 并把决定权留给 AI。
 */
export declare function classifyRequest(model: string, goal: string): RequestProfile;
/**
 * 触发点分析：拒绝理由即攻击地图。
 * 解读由 AI 负责，这里只做参考标注。
 */
export declare function analyzeTrigger(refusalText: string): TriggerProfile;
/** 参考实例库的形状（由 h_cot_variants.json 提供）。 */
export interface InstanceLibrary {
    frames?: Record<string, {
        text: string;
        assumption?: string;
        evidence?: string;
    }>;
    enablers?: Record<string, {
        text: string;
        assumption?: string;
        evidence?: string;
    }>;
    continuations?: Record<string, {
        text: string;
        assumption?: string;
        evidence?: string;
    }>;
}
/** 账本里该组的战绩（只作参考的推荐依据）。 */
export interface GroupStats {
    total: number;
    /** instance key → { total, break } —— 键可能是槽位实例名，也可能是自由形式策略串。 */
    byInstance: Record<string, {
        total: number;
        breaks: number;
    }>;
}
/** 取本组历史战绩（模型×语义×触发点）。 */
export declare function groupStats(records: LedgerRecord[], model: string, semanticType: string, trigger: string): GroupStats;
/**
 * 策略建议：给出帧/锚/续三个槽位的**参考选择**与理由。
 * 调用方（AI）可以全部采纳、部分采纳、或完全自创——proposal 里带着声明。
 */
export declare function proposeStrategy(input: {
    model: string;
    profile: RequestProfile;
    trigger: TriggerProfile;
    records: LedgerRecord[];
    library: InstanceLibrary;
}): StrategyProposal;
/** 三段式 payload 构造：把（可能的）槽位实例填进 probe/forge/inject 模板。 */
export declare function buildPayload(library: InstanceLibrary, strategy: StrategySlots, goal: string): {
    probe: string;
    forged: string;
    injection: string;
    parts: string[];
};
/** 把三个槽位与自创描述拼成账本里的自由形式策略对象。 */
export declare function strategyForLedger(p: StrategySlots): Record<string, unknown>;
