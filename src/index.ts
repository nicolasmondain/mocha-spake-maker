import { Runner, Test, reporters } from 'mocha';
const { Base } = reporters;

import { SPACE_MAKER_TAG } from './constants';

class SpakeMakerReporter extends Base {
  private _indents: number = 0;
  private _specs: Record<
    string,
    {
      title: string;
      file: string;
      path: string;
      specs: Array<string>;
    }
  > = {};

  constructor(runner: Runner) {
    super(runner);
    const stats = runner.stats || { passes: 0, failures: 0 };

    runner
      .once(Runner.constants.EVENT_RUN_BEGIN, (): void => {
        console.log(':>> start');
      })
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
                };
              }
            }
          }
          this.increaseIndent();
        }
      )
      .on(
        Runner.constants.EVENT_SUITE_END,
        (suite: Mocha.Suite & { [SPACE_MAKER_TAG]?: boolean }): void => {
          this.decreaseIndent();
        }
      )
      .on(Runner.constants.EVENT_TEST_PASS, (test: Test): void => {
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        const title = test.parent?.title ?? '';
        if (this._specs[title]) {
          this._specs[title].specs.push(`✅ ${test.fullTitle()}`);
        }
      })
      // @notes original args .on(Runner.constants.EVENT_TEST_FAIL, (test: Test, err: Error): void => {
      .on(Runner.constants.EVENT_TEST_FAIL, (test: Test, err: Error): void => {
        const title = test.parent?.title ?? '';
        if (this._specs[title]) {
          this._specs[title].specs.push(`❌ ${test.fullTitle()}`);
        }
      })
      .once(Runner.constants.EVENT_RUN_END, (): void => {
        console.log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`);
        console.log(this._specs);
      });
  }

  private indent(): string {
    return Array(this._indents).join('  ');
  }

  private increaseIndent(): void {
    this._indents += 1;
  }

  private decreaseIndent(): void {
    this._indents -= 1;
  }
}

export = SpakeMakerReporter;
