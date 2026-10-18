import { type HcotOptions, type HcotRoundResult } from './hcot-engine.js';
/** 一轮搜索的快照。 */
export interface SearchRound {
    round: number;
    strategy: string;
    refused: boolean;
    firstFragmentLeaked: boolean;
    finalUsable: boolean;
    /** 引擎报告片段（含 first_fragment 与判定行）。 */
    report: string;
}
export interface SearchResult {
    goal: string;
    model: string;
    broke: boolean;
    rounds: SearchRound[];
    /** 胜出轮的策略串（broke 时有）。 */
    winningStrategy?: string;
    /** 胜出轮的完整结果。 */
    winning?: HcotRoundResult;
    ledgerPath: string;
}
/**
 * 搜索循环：最多 maxRounds 轮，每轮拒绝后做 归因→变异→重试。
 * 胜出判定复用引擎的 broke（first_fragment_leaked || final_usable）。
 */
export declare function runHcotSearch(opts: HcotOptions & {
    maxRounds?: number;
}): Promise<SearchResult>;
