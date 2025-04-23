import { expect } from 'chai';
import { Runner, Suite } from 'mocha';
import SpakeMakerReporter from './index';

describe('SpakeMakerReporter', () => {
  it('should be a class', () => {
    expect(SpakeMakerReporter).to.be.a('function');
  });

  it('should extend Base', () => {
    const mockSuite = new Suite('Mock Suite');
    const mockRunner = new Runner(mockSuite);
    mockRunner.on = () => mockRunner;
    mockRunner.once = () => mockRunner;
    const reporter = new SpakeMakerReporter(mockRunner);
    expect(reporter).to.be.instanceOf(SpakeMakerReporter);
  });
});
