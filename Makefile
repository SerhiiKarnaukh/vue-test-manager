# Load variables from .env
include .env
export

run:
	npm run dev

node:
	nvm install $(NODE_VERSION)
	nvm use $(NODE_VERSION)
	npm update npm -g
	npm install -g npm-check-updates
	npm install -g firebase-tools
	versions=$$(nvm list | grep -v 'Current' | grep -v '*' | tr -d ' \r'); \
	for v in $$versions; do \
		echo "Uninstalling $$v"; \
		nvm uninstall $$v; \
	done

update:
	rm -rf node_modules
	rm -f package-lock.json
	ncu
	ncu -u
	npm install
