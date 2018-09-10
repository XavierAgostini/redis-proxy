PROJECT = "Redis Proxy Server"

install: ;@echo "Installing ${PROJECT}....."; \
	npm install

clean: ;@echo "Cleaning ${PROJECT}....."; \
	rm -rf node_modules
	rm .env
build: ;@echo "Building ${PROJECT}....."; \
	npm install

test: ;@echo "Test ${PROJECT}....."; \
	make clean
	make build
	node config/config-test.js
	docker-compose -f docker-compose.test.yml up
	
start: ;@echo "Starting ${PROJECT}....."; \
	# make build
	node config/config.js
	docker-compose -f docker-compose.yml build
	docker-compose -f docker-compose.yml up -d
