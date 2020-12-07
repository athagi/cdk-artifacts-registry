# cdk-artifacets-registry
this is a project for Typescript development with CDK.
this project creates multiple stacks about IAM and ECR following `bin/files/...txt` .

# How to deploy
## Getting started
You can command

```
make deploy
```

to deploy as default value. It takes no cost.

## Change configure

You can change variables to change `.env` file.
Or you can set Environment variables then override default variables.


## Useful commands

 * `make test`        perform the jest unit tests
 * `make update-test` update snapshot and perform the jest unit tests
 * `make deploy`      deploy this stack to your default AWS account/region
 * `npm run build`    compile typescript to js
 * `npm run watch`    watch for changes and compile
 * `cdk diff`         compare deployed stack with current state
 * `cdk synth`        emits the synthesized CloudFormation template
