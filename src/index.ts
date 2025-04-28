import { Runner, Test, reporters } from 'mocha';
const { Markdown } = reporters;

import { SPACE_MAKER_TAG } from './constants';

class SpakeMakerReporter extends Markdown {
  private _indents: number = 0;

  constructor(runner: Runner) {
    super(runner);
    const stats = runner.stats || { passes: 0, failures: 0 };

    runner
      .once(Runner.constants.EVENT_RUN_BEGIN, () => {
        console.log(':>> start');
      })
      .on(
        Runner.constants.EVENT_SUITE_BEGIN,
        (suite: Mocha.Suite & { [SPACE_MAKER_TAG]?: boolean }) => {
          console.log(':>> ', SPACE_MAKER_TAG, suite);
          if (suite[SPACE_MAKER_TAG]) {
            console.log(':>> ', suite.title);
          }
          this.increaseIndent();
        }
      )
      .on(
        Runner.constants.EVENT_SUITE_END,
        (suite: Mocha.Suite & { [SPACE_MAKER_TAG]?: boolean }) => {
          if (suite[SPACE_MAKER_TAG]) {
            console.log(suite.title);
          }
          this.decreaseIndent();
        }
      )
      .on(Runner.constants.EVENT_TEST_PASS, (test: Test) => {
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        console.log(`${this.indent()}pass: ${test.fullTitle()}`);
      })
      .on(Runner.constants.EVENT_TEST_FAIL, (test: Test, err: Error) => {
        console.log(`${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`);
      })
      .once(Runner.constants.EVENT_RUN_END, () => {
        console.log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`);
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
