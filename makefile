clean:
	rm -rd cdk.out

install:
	sudo npm install

deploy:
	cdk deploy

synth:
	cdk synth

.PHONY: test
test:
	npm run test

build:
	npm run build

watch:
	npm run watch