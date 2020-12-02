import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as App from '../lib/app-stack';


// test('Empty Stack', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new App.AppStack(app, 'MyTestStack');
//     // THEN
//     expectCDK(stack).to(matchTemplate({
//       "Resources": {}
//     }, MatchStyle.EXACT))
// });



test('ECR project Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new App.AppStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
    
    RepositoryName: "hogehoge",
    ImageScanningConfiguration: {
      scanOnPush: true
    },
  }));
});


test('ECR repository count', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new App.AppStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(countResources("AWS::ECR::Repository", 1))
   
});
