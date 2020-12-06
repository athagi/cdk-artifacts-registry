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
	npm test -- --coverage

.PHONY: update-test
update-test:
	npm test -- -u

build:
	npm run build

watch:
	npm run watch