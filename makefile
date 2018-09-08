PROJECT = "Redis Proxy Server"

all: clean install configure test start

install: ;@echo "Installing ${PROJECT}....."; \
			npm install

clean: ;@echo "Cleaning ${PROJECT}....."; \
		rm -rf node_modules \
		rm -rf config/*

test: ;@echo "Test ${PROJECT}....."; \
		npm run test

configure: ;@echo "Configure ${PROJECT}....."; \
		node index.js configure -r 127.0.0.1:6379 -e 1000 -c 10 -p 3000
start: ;@echo "Starting ${PROJECT}....."; \
		npm run start