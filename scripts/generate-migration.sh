#!/bin/bash

# Script para gerar migrations usando banco temporário limpo
# Uso: ./scripts/generate-migration.sh src/migrations/NomeMigration

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se o nome da migration foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}Erro: Nome da migration é obrigatório${NC}"
    echo "Uso: npm run migration:generate NomeMigration"
    exit 1
fi

# Adicionar prefixo src/migrations/ automaticamente
MIGRATION_NAME="src/migrations/$1"
TEMP_DB_NAME="temp_migration_$(date +%s)"

# Carregar variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

# Verificar se psql está disponível ou se Docker está disponível
USE_DOCKER=false
USE_SUDO=false
if ! command -v psql &> /dev/null; then
    if command -v docker &> /dev/null; then
        # Tentar verificar containers sem sudo primeiro
        if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "example-project-db"; then
            USE_DOCKER=true
            echo -e "${YELLOW}ℹ️  psql não encontrado, usando Docker${NC}"
        elif sudo docker ps --format '{{.Names}}' 2>/dev/null | grep -q "example-project-db"; then
            USE_DOCKER=true
            USE_SUDO=true
            echo -e "${YELLOW}ℹ️  psql não encontrado, usando Docker com sudo${NC}"
        else
            echo -e "${RED}Erro: psql não encontrado e container Docker não está rodando${NC}"
            echo "Inicie o PostgreSQL com: docker compose up -d example-project-db"
            echo ""
            echo -e "${YELLOW}💡 Dica: Para evitar usar sudo, adicione seu usuário ao grupo docker:${NC}"
            echo "  sudo usermod -aG docker $USER"
            echo "  (depois faça logout/login)"
            exit 1
        fi
    else
        echo -e "${RED}Erro: psql não encontrado e Docker não está disponível${NC}"
        echo "Instale o PostgreSQL client ou Docker"
        exit 1
    fi
fi

# Função para executar psql (local ou via Docker)
run_psql() {
    local query="$1"
    if [ "$USE_DOCKER" = true ]; then
        if [ "$USE_SUDO" = true ]; then
            sudo docker exec -i example-project-db psql -U $DB_USERNAME -d postgres -c "$query"
        else
            docker exec -i example-project-db psql -U $DB_USERNAME -d postgres -c "$query"
        fi
    else
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "$query"
    fi
}

echo -e "${YELLOW}🔄 Verificando conexão com PostgreSQL...${NC}"
echo -e "Host: $DB_HOST:$DB_PORT"
echo -e "User: $DB_USERNAME"

# Testar conexão
run_psql "SELECT 1;" > /dev/null 2>&1 || {
    echo -e "${RED}❌ Erro ao conectar ao PostgreSQL${NC}"
    if [ "$USE_DOCKER" = false ]; then
        echo -e "${YELLOW}Verifique:${NC}"
        echo "  - PostgreSQL está rodando?"
        echo "  - Credenciais corretas no .env?"
        echo "  - Host e porta corretos?"
        echo ""
        echo "Tentando conectar com:"
        echo "  Host: $DB_HOST"
        echo "  Port: $DB_PORT"
        echo "  User: $DB_USERNAME"
    else
        echo -e "${YELLOW}Verifique se o container está rodando:${NC}"
        echo "  docker compose up -d example-project-db"
    fi
    exit 1
}

echo -e "${GREEN}✅ Conexão com PostgreSQL OK${NC}"
echo -e "${YELLOW}🔄 Criando banco temporário para geração de migration...${NC}"

# Criar banco temporário
run_psql "CREATE DATABASE $TEMP_DB_NAME;" 2>&1 || {
    echo -e "${RED}❌ Erro ao criar banco temporário${NC}"
    exit 1
}

echo -e "${GREEN}✅ Banco temporário criado: $TEMP_DB_NAME${NC}"

# Verificar se existem migrations para executar
MIGRATION_FILES=$(find src/migrations -name "*.ts" -type f 2>/dev/null | wc -l)

if [ "$MIGRATION_FILES" -gt 0 ]; then
    echo -e "${YELLOW}🔄 Executando migrations existentes no banco temporário...${NC}"
    
    # Executar migrations existentes no banco temporário
    DB_NAME=$TEMP_DB_NAME npm run _migration:run:temp > /dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️  Aviso: Algumas migrations podem ter falhado (normal se já foram executadas)${NC}"
    }
    
    echo -e "${GREEN}✅ Migrations existentes aplicadas no banco temporário${NC}"
else
    echo -e "${YELLOW}ℹ️  Nenhuma migration existente encontrada${NC}"
fi

# Configurar variável de ambiente para usar banco temporário
export DB_NAME=$TEMP_DB_NAME

echo -e "${YELLOW}🔄 Comparando entidades com banco temporário...${NC}"

# Gerar migration usando banco temporário (que já tem as migrations aplicadas)
DB_NAME=$TEMP_DB_NAME npm run _migration:generate:temp "$MIGRATION_NAME" 2>&1 | tee /tmp/migration_output.log || {
    # Verificar se o erro é "No changes found" (isso é OK!)
    if grep -q "No changes in database schema were found" /tmp/migration_output.log 2>/dev/null; then
        echo -e "${GREEN}✅ Nenhuma mudança encontrada - não é necessário gerar migration${NC}"
        # Limpar banco temporário
        run_psql "DROP DATABASE IF EXISTS $TEMP_DB_NAME;" > /dev/null 2>&1
        rm -f /tmp/migration_output.log
        exit 0
    else
        echo -e "${RED}❌ Erro ao gerar migration${NC}"
        # Limpar banco temporário em caso de erro
        run_psql "DROP DATABASE IF EXISTS $TEMP_DB_NAME;" > /dev/null 2>&1
        rm -f /tmp/migration_output.log
        exit 1
    fi
}

rm -f /tmp/migration_output.log

echo -e "${GREEN}✅ Migration gerada com sucesso!${NC}"

# Remover banco temporário
echo -e "${YELLOW}🧹 Removendo banco temporário...${NC}"
run_psql "DROP DATABASE IF EXISTS $TEMP_DB_NAME;" > /dev/null 2>&1

echo -e "${GREEN}✅ Banco temporário removido${NC}"
echo -e "${GREEN}✨ Processo concluído!${NC}"

