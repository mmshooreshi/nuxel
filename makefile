# Define the variables
DOCKER_COMPOSE = docker-compose
DOCKER = docker
PNPM = pnpm
BUILD_DIR = .output

# Default target
.DEFAULT_GOAL := help

# Include other Makefiles
# include docker.mk

# Help target
.PHONY: help
help:
	@echo "Makefile for Nuxt.js project with Docker"
	@echo ""
	@echo "Available targets:"
	@echo "  help                - Show this help message"
	@echo "  build               - Build the project"
	@echo "  dev                 - Run development server"
	@echo "  lint                - Lint the code"
	@echo "  test                - Run tests"
	@echo "  clean               - Clean the build directory"
	@echo "  docker-build        - Build Docker images"
	@echo "  docker-up           - Start Docker containers"
	@echo "  docker-down         - Stop Docker containers"
	@echo "  logs                - Show colorized logs"
	@echo "  multi-logs          - Show logs from multiple containers"
	@echo "  git-docker-aliases  - Setup Git aliases for Docker"
	@echo "  install-dive        - Install dive tool"
	@echo "  install-git-filter-repo - Install git-filter-repo tool"
	@echo "  install-docker-compose-gitops - Install docker-compose-gitops tool"

# Build target
.PHONY: build
build:
	$(PNPM) run build

# Development target
.PHONY: dev
dev:
	$(PNPM) run dev

# Lint target
.PHONY: lint
lint:
	$(PNPM) run lint

# Test target
.PHONY: test
test:
	$(PNPM) run test

# Clean target
.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

# Docker build target
.PHONY: docker-build
docker-build:
	$(DOCKER_COMPOSE) build

# Docker up target
.PHONY: docker-up
docker-up:
	$(DOCKER_COMPOSE) up -d

# Docker down target
.PHONY: docker-down
docker-down:
	$(DOCKER_COMPOSE) down

# Colorized logs target using ccze
.PHONY: logs
logs:
	$(DOCKER) logs -f <container_name> | ccze -A

# Multi-container logs using docker-compose
.PHONY: multi-logs
multi-logs:
	$(DOCKER_COMPOSE) logs -f

# Multi-container logs using multitail
.PHONY: multi-logs-tail
multi-logs-tail:
	multitail -ci green -I `docker logs <container_1>` -ci yellow -I `docker logs <container_2>`

# Setup Git aliases for Docker
.PHONY: git-docker-aliases
git-docker-aliases:
	@echo "alias dps='docker ps --format \"table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\"'" >> ~/.bashrc
	@echo "alias dlg='docker ps --format \"table {{.ID}}\\t{{.Image}}\\t{{.Names}}\\t{{.Status}}\\t{{.Ports}}\"'" >> ~/.bashrc
	@source ~/.bashrc

# Install dive tool
.PHONY: install-dive
install-dive:
	curl -Lo dive https://github.com/wagoodman/dive/releases/download/v0.10.0/dive_0.10.0_linux_amd64.deb
	sudo dpkg -i dive_0.10.0_linux_amd64.deb
	rm dive_0.10.0_linux_amd64.deb

# Install git-filter-repo tool
.PHONY: install-git-filter-repo
install-git-filter-repo:
	pip install git-filter-repo

# Install docker-compose-gitops tool
.PHONY: install-docker-compose-gitops
install-docker-compose-gitops:
	git clone https://github.com/kbst/docker-compose-gitops.git
	cd docker-compose-gitops && make install
