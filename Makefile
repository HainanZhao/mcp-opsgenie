.PHONY: install build start dev test clean help

# Default target
help:
	@echo "Available targets:"
	@echo "  install    - Install dependencies"
	@echo "  build      - Build the TypeScript project"
	@echo "  start      - Start the MCP server"
	@echo "  dev        - Start development server with auto-reload"
	@echo "  test       - Run tests"
	@echo "  clean      - Clean build artifacts"
	@echo "  help       - Show this help message"

install:
	npm install

build:
	npm run build

start: build
	npm start

dev:
	npm run dev

test: build
	npm test

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-lock.json

setup: install
	@echo "Setting up environment..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file from .env.example"; \
		echo "Please edit .env and add your OPSGENIE_API_KEY"; \
	else \
		echo ".env file already exists"; \
	fi