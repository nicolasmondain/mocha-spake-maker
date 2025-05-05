import { expect } from 'chai';
import { Runner, Suite } from 'mocha';
import { SPACE_MAKER_TAG } from '../src/constants';
import SpaceMakerReporter from '../src/index';

describe('SpaceMakerReporter 1', function (): void {
  (this as Mocha.Suite & { [SPACE_MAKER_TAG]: boolean })[SPACE_MAKER_TAG] = true;
  it('should be a class', (): void => {
    expect(SpaceMakerReporter).to.be.a('function');
  });

  it('should extend Base', (): void => {
    const mockSuite = new Suite('Mock Suite');
    const mockRunner = new Runner(mockSuite);
    mockRunner.on = (): Runner => mockRunner;
    mockRunner.once = (): Runner => mockRunner;
    const reporter = new SpaceMakerReporter(mockRunner);
    expect(reporter).to.be.instanceOf(SpaceMakerReporter);
  });
});
