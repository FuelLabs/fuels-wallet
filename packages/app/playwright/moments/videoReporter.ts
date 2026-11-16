import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type {
  FullConfig,
  Reporter,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

type Clip = {
  id: string;
  file: string;
  title: string;
  status: string;
  video: string;
  /** Milliseconds from the start of the video. */
  steps: { title: string; start: number; end: number }[];
};

function flatten(steps: TestStep[]): TestStep[] {
  return steps.flatMap((step) => [step, ...flatten(step.steps)]);
}

/**
 * Writes `manifest.json` next to the recordings: each test's video and when
 * its `test.step`s ran, so the clips can be cut and captioned.
 */
export default class VideoReporter implements Reporter {
  private clips: Clip[] = [];
  private outDir = '';

  onBegin(config: FullConfig) {
    this.outDir = join(
      dirname(config.configFile ?? ''),
      'playwright-results/moments-video'
    );
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const video = result.attachments.find((a) => a.name === 'video')?.path;
    if (!video) return;
    const all = flatten(result.steps);
    // The recording starts once the page fixture is up.
    const page = all.find(
      (s) => s.category === 'fixture' && s.title === 'page'
    );
    const zero = page
      ? page.startTime.getTime() + page.duration
      : result.startTime.getTime();
    this.clips.push({
      id: `${test.location.file.split('/').pop()?.replace('.spec.ts', '')}-${test.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-$/, ''),
      file: test.location.file.split('/').pop() ?? '',
      title: test.title,
      status: result.status,
      video,
      steps: result.steps
        .filter((s) => s.category === 'test.step')
        .map((s) => ({
          title: s.title,
          start: Math.max(0, s.startTime.getTime() - zero),
          end: Math.max(0, s.startTime.getTime() + s.duration - zero),
        })),
    });
  }

  onEnd() {
    mkdirSync(this.outDir, { recursive: true });
    writeFileSync(
      join(this.outDir, 'manifest.json'),
      JSON.stringify(this.clips, null, 2)
    );
  }
}
