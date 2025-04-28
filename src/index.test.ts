import { expect } from 'chai';
import { Runner, Suite } from 'mocha';
import SpakeMakerReporter from './index';

describe('SpakeMakerReporter', function () {
  this.SPACE_MAKER_TAG = true;
  it('should be a class', () => {
    expect(SpakeMakerReporter).to.be.a('function');
  });

  it('should extend Base', () => {
    const mockSuite = new Suite('Mock Suite');
    const mockRunner = new Runner(mockSuite);
    mockRunner.on = (): Runner => mockRunner;
    mockRunner.once = (): Runner => mockRunner;
    const reporter = new SpakeMakerReporter(mockRunner);
    expect(reporter).to.be.instanceOf(SpakeMakerReporter);
  });
});
