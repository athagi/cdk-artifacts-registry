clean:
	rm -rd cdk.out

install:
	sudo npm install

deploy:
	cdk deploy --all

synth:
	cdk synth

.PHONY: test
test:
	npm run test

.PHONY: update-test
test:
	npm test -- -u


build:
	npm run build

watch:
	npm run watch