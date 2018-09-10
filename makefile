PROJECT = "Redis Proxy Server"

all: clean install configure test start

install: ;@echo "Installing ${PROJECT}....."; \
	npm install

clean: ;@echo "Cleaning ${PROJECT}....."; \
	rm -rf node_modules

build: ;@echo "Building ${PROJECT}....."; \
	npm install

test: ;@echo "Test ${PROJECT}....."; \
	make clean
	make build
	docker-compose up
	
start: ;@echo "Starting ${PROJECT}....."; \
	make build
	docker-compose build
	docker-compose up -d
	docker-compose stop redis
