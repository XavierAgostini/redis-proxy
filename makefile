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
	docker-compose up
	
start: ;@echo "Starting ${PROJECT}....."; \
	# make build
	node config/config.js
	docker-compose build
	docker-compose up
	docker-compose stop redis
