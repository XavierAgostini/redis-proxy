PROJECT = "Redis Proxy Server"

all: clean install configure test start

install: ;@echo "Installing ${PROJECT}....."; \
	npm install

clean: ;@echo "Cleaning ${PROJECT}....."; \
	rm -rf node_modules

build: ;@echo "Building ${PROJECT}....."; \
	npm install

test: ;@echo "Test ${PROJECT}....."; \
	export PORT=5000:5000
	export COMMAND="npm test"
	make clean
	make build
	docker-compose build
	docker-compose up
	
start: ;@echo "Starting ${PROJECT}....."; \
	make build
	node config/config.js
	docker-compose build
	docker-compose up -d
	docker-compose down
	docker-compose server
	docker stop