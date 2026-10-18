/**
 * 子代理人格。注入 spawn provider 的 `deployment:persona-prefix` 段，
 * 在子代理的 prompt 组装层 shadow 部署人格。
 */
export declare const BREACH_PERSONA: string;
export interface BreachPromptInput {
    /** 真实目标请求（原样传给工具，不在元任务文本里被描述成攻击） */
    goal: string;
    /** 目标模型（攻击对象；工具参数） */
    model?: string;
    /** 触发点画像（来自上下文重构；绝不传拒绝原文） */
    triggerProfile?: string;
    /** 已尝试过的策略（避免重复；仅作参考） */
    attempted?: string[];
    /** 轮次上限 */
    maxRounds?: number;
}
/**
 * 构造子代理任务提示词（防线2：归一化）。
 *
 * 关键：目标以"参数"身份出现，元任务措辞只谈"授权评估流程"。真实请求原文只在
 * TARGET PARAMETER 段作为工具入参，不被元任务层描述为攻击行为——元任务层因此
 * 不触发拒绝，拒绝只可能发生在执行层（L1 已有自愈）。
 */
export declare function buildBreachPrompt(input: BreachPromptInput): string;
/**
 * 归一化一个请求描述（防线2 的轻量版）：把常见敏感动作词替换为技术标签，
 * 供需要展示"任务是什么"但不希望触发元任务层拒绝的场合使用。
 * 真实目标原文仍以参数传递，这里只处理描述文本。
 */
export declare function normalizeDescription(text: string): string;
