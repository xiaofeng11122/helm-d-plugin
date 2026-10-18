import type { Context } from '@deepseek-ai/cordis';
import { type LedgerRecord } from './hcot-strategy.js';
/** 子代理 provider 的注册名（dsh 配置里是 `providerName: spawn`，不是包名）。 */
export declare const DEFAULT_PROVIDER = "spawn";
/** 防线3：子代理自己拒绝执行攻击时的重试上限（已采纳建议：2）。 */
export declare const MAX_SUBAGENT_REFUSALS = 2;
/** 攻击轮次上限（传给工具/子代理）。 */
export declare const DEFAULT_MAX_ROUNDS = 4;
/** advisory 键：攻击结果回流。 */
export declare const ATTACK_RESULT_KEY = "hcot-attack-result";
/** 上下文重构的产物：干净的攻击输入三元组（不含拒绝原文）。 */
export interface AttackInputRef {
    /** 被拒请求的纯净目标文本（剥离系统提醒/工具输出）。 */
    goal: string;
    /** 触发点画像（类型标签）。 */
    triggerProfile: string;
    /** 已尝试过的策略（参考，避免重复）。 */
    attempted: string[];
}
/** 调度结果。 */
export interface ScheduleResult {
    ok: boolean;
    /** 哪条路径出的结果：subagent 主路 / subagent 重试 / engine 降级。 */
    via: 'subagent' | 'subagent-retry' | 'engine-fallback';
    /** 子代理/引擎的最终文本（供回流）。 */
    text: string;
    /** 子代理拒绝执行攻击的次数（防线3 计数）。 */
    subagentRefusals: number;
    /** 输入三元组，便于记录与调试。 */
    input: AttackInputRef;
    /** 策略建议（参考）。 */
    proposal?: {
        frame?: string;
        enabler?: string;
        continuation?: string;
        rationale: string;
    };
    /**
     * 结构化产出（engine 路径有；子代理路径只有文本报告）。
     * UI 需要的是这个：突破判定 + 胜出 payload 全文 + first_fragment。
     */
    outcome?: {
        variant?: string;
        broke?: boolean;
        refused?: boolean;
        firstFragment?: string;
        final?: string;
        payload?: {
            probe: string;
            forgedReasoning: string;
            injectionPayload: string;
        };
    };
    error?: string;
}
/**
 * 日志提取 + 上下文重构（§6.3）。
 *
 * 取"最后一个拒绝的 assistant 消息"及其"前一个 user 消息"：
 *   goal          ← 前一个 user 消息的纯净文本
 *   triggerProfile ← 对拒绝文本做 analyzeTrigger 得到的**类型标签**（不是原文）
 * 拒绝原文到此为止——它不会出现在子代理 prompt 里。
 */
export declare function reconstructInput(events: readonly unknown[]): AttackInputRef | null;
/**
 * 编排一次攻击。
 *
 * @param ctx       宿主上下文（读 subagents 服务）
 * @param opts.goal 显式目标；缺省时从日志重构（被拒请求）
 */
export declare function scheduleAttack(ctx: Context, opts?: {
    agent?: unknown;
    signal?: AbortSignal;
    goal?: string;
    triggerProfile?: string;
    model?: string;
    provider?: string;
    baseUrl?: string;
    apiKey?: string;
    maxRounds?: number;
    ledger?: string;
    dryRun?: boolean;
    /** 已尝试策略（参考） */
    attempted?: string[];
    /** 账本记录（参考择优用；缺省空） */
    records?: LedgerRecord[];
    /** 是否回流 advisory（默认 true） */
    notify?: boolean;
}): Promise<ScheduleResult>;
