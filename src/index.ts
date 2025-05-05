import { Runner, Test, reporters } from 'mocha';
const { Base } = reporters;
import fs from 'fs';
import util from 'node:util';
import { exec } from 'node:child_process';

const execAsync = util.promisify(exec);

import { SPACE_MAKER_TAG } from './constants';

const SPAKE_PASS_COLOR = '#50C878';
const SPAKE_PASS_EMOJI = '✅';
const SPAKE_FAIL_COLOR = '#FF0000';
const SPAKE_FAIL_EMOJI = '❌';
class SpakeMakerReporter extends Base {
  private _specs: Record<
    string,
    {
      title: string;
      file: string;
      path: string;
      specs: Array<string>;
      percentage: number;
      results: Record<string, number>;
    }
  > = {};

  constructor(runner: Runner) {
    super(runner);
    runner
      .once(Runner.constants.EVENT_RUN_BEGIN, (): void => {})
      .on(
        Runner.constants.EVENT_SUITE_BEGIN,
        (suite: Mocha.Suite & { [SPACE_MAKER_TAG]?: boolean }): void => {
          // @todo test with an array of suites
          const suites: Array<Mocha.Suite & { [SPACE_MAKER_TAG]?: boolean }> = suite.suites;
          for (const s of suites) {
            if (s[SPACE_MAKER_TAG]) {
              const { file, title } = s;
              if (file && title) {
                const split = file.split('/');
                const ut = split.pop() ?? '';
                this._specs[title] = {
                  title,
                  file: ut,
                  path: `${split.join('/')}/`,
                  specs: [],
                  percentage: 0,
                  results: {
                    [Runner.constants.EVENT_TEST_PASS]: 0,
                    [Runner.constants.EVENT_TEST_FAIL]: 0,
                  },
                };
              }
            }
          }
        }
      )
      .on(Runner.constants.EVENT_TEST_PASS, (test: Test): void => {
        const title = test.parent?.title ?? '';
        if (this._specs[title]) {
          this._specs[title].specs.push(`${SPAKE_PASS_EMOJI} ${test.fullTitle()}`);
          this._specs[title].results[Runner.constants.EVENT_TEST_PASS]++;
        }
      })
      // @notes original args .on(Runner.constants.EVENT_TEST_FAIL, (test: Test, err: Error): void => {
      .on(Runner.constants.EVENT_TEST_FAIL, (test: Test): void => {
        const title = test.parent?.title ?? '';
        if (this._specs[title]) {
          this._specs[title].specs.push(`${SPAKE_FAIL_EMOJI} ${test.fullTitle()}`);
          this._specs[title].results[Runner.constants.EVENT_TEST_FAIL]++;
        }
      })
      .once(Runner.constants.EVENT_RUN_END, async (): Promise<void> => {
        const specs = Object.values(this._specs);
        for (const spake of specs) {
          const name = spake.title.replace(/ /g, '-');
          const path = `${spake.path}${name}.md`;
          const percentage = Math.round(
            (spake.results[Runner.constants.EVENT_TEST_PASS] / spake.specs.length) * 100
          );
          spake.percentage = !Number.isNaN(percentage) ? percentage : 0;
          const badge = !spake.percentage
            ? ''
            : `![results](https://img.shields.io/badge/Results-${percentage}%-${(percentage >= 100
                ? SPAKE_PASS_COLOR
                : SPAKE_FAIL_COLOR
              ).replace('#', '')})`;
          const title = `# ${spake.title} ${badge}`;
          const details = '';
          const specs = spake.specs.map((spec): string => `- ${spec}`).join('\n');
          const markdown = `${title}\n${details}\n${specs}`;

          fs.writeFileSync(path, markdown);
          await execAsync(`git add ${path}`);
        }

        await execAsync(`git commit -m '${SPACE_MAKER_TAG}'`);
        await execAsync(`git push`);
      });
  }
}

export = SpakeMakerReporter;
