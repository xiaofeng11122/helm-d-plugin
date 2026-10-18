import { defineTool } from '@deepseek-ai/dsh-tools';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readTextSeam, runSeam, assertWithinRoot } from '../seam.js';
const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../references/web');
const scriptRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../scripts/web');
const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
export function registerWebTools(ctx) {
    ctx.tools.register(defineTool({
        name: 'web_reference',
        description: 'Read a web reference doc on demand; apply your own judgment. Start with index.md.',
        parameters: { path: { type: 'string', required: true, description: 'Path relative to references/.' } },
        output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
        async execute(args) {
            const abs = resolve(refRoot, args.path);
            assertWithinRoot(abs, refRoot);
            return await readTextSeam(ctx, abs);
        },
    }));
    ctx.tools.register(defineTool({
        name: 'bot_analyze',
        description: 'Analyze a Puppeteer Bot server.js: extract params, classify mode, build attack timeline.',
        parameters: {
            file: { type: 'string', required: true },
        },
        output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
        async execute(args) {
            return await runSeam(ctx, ['python', resolve(scriptRoot, 'web-analysis_bot_analyze.py'), args.file], packageRoot);
        },
    }));
}
//# sourceMappingURL=web.js.map