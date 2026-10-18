import { defineTool } from '@deepseek-ai/dsh-tools';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSeam } from '../seam.js';
const scriptRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../scripts/android');
const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
export function registerAndroidTools(ctx) {
    ctx.tools.register(defineTool({
        name: 'apk_fingerprint',
        description: 'Detect APK framework / HTTP stack / obfuscation. Read references/fingerprint.md for interpretation.',
        parameters: {
            apk: { type: 'string', required: true, description: 'Path to the APK/XAPK file.' },
        },
        output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
        async execute(args) {
            return await runSeam(ctx, ['bash', resolve(scriptRoot, 'fingerprint.sh'), args.apk], packageRoot);
        },
    }));
}
//# sourceMappingURL=android.js.map