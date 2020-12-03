import { expect as expectCDK, matchTemplate, MatchStyle, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as App from '../lib/app-stack';

describe('fine grained test', () => {
  it('Empty Stack', () => {
      const app = new cdk.App();
      // WHEN
      const stack = new App.AppStack(app, 'MyTestStack');
      // THEN
      expectCDK(stack).to(matchTemplate({
        "Resources": {}
      }, MatchStyle.EXACT))
  });
})


describe('snapshot test', () => {
  it('Empty Stack', () => {
      const app = new cdk.App();
      // WHEN
      const stack = new App.AppStack(app, 'MyTestStack');
      // THEN
      expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
})
