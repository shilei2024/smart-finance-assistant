#!/bin/bash

# 华为云服务器初始化脚本
# 使用方法: ./setup-server.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检测操作系统
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
    else
        log_error "无法检测操作系统"
        exit 1
    fi
    log_info "检测到操作系统: $OS $VER"
}

# 更新系统
update_system() {
    log_info "更新系统..."
    if [ "$OS" == "ubuntu" ]; then
        sudo apt update && sudo apt upgrade -y
    elif [ "$OS" == "centos" ] || [ "$OS" == "rhel" ]; then
        sudo yum update -y
    fi
    log_success "系统更新完成"
}

# 安装Docker
install_docker() {
    log_info "安装Docker..."
    
    if command -v docker &> /dev/null; then
        log_warning "Docker已安装"
        return
    fi
    
    if [ "$OS" == "ubuntu" ]; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    elif [ "$OS" == "centos" ] || [ "$OS" == "rhel" ]; then
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
    fi
    
    log_success "Docker安装完成"
}

# 安装Docker Compose
install_docker_compose() {
    log_info "安装Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log_warning "Docker Compose已安装"
        return
    fi
    
    DOCKER_COMPOSE_VERSION="v2.20.0"
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_success "Docker Compose安装完成"
}

# 配置防火墙
setup_firewall() {
    log_info "配置防火墙..."
    
    if [ "$OS" == "ubuntu" ]; then
        if command -v ufw &> /dev/null; then
            sudo ufw allow 22/tcp
            sudo ufw allow 80/tcp
            sudo ufw allow 443/tcp
            echo "y" | sudo ufw enable
        fi
    elif [ "$OS" == "centos" ] || [ "$OS" == "rhel" ]; then
        if command -v firewall-cmd &> /dev/null; then
            sudo firewall-cmd --permanent --add-port=22/tcp
            sudo firewall-cmd --permanent --add-port=80/tcp
            sudo firewall-cmd --permanent --add-port=443/tcp
            sudo firewall-cmd --reload
        fi
    fi
    
    log_success "防火墙配置完成"
}

# 安装必要工具
install_tools() {
    log_info "安装必要工具..."
    
    if [ "$OS" == "ubuntu" ]; then
        sudo apt install -y curl wget git vim nano htop
    elif [ "$OS" == "centos" ] || [ "$OS" == "rhel" ]; then
        sudo yum install -y curl wget git vim nano htop
    fi
    
    log_success "工具安装完成"
}

# 创建项目目录
create_project_dir() {
    log_info "创建项目目录..."
    sudo mkdir -p /opt/smart-finance
    sudo chown $USER:$USER /opt/smart-finance
    log_success "项目目录创建完成: /opt/smart-finance"
}

# 主函数
main() {
    log_info "开始初始化华为云服务器..."
    
    detect_os
    update_system
    install_tools
    install_docker
    install_docker_compose
    setup_firewall
    create_project_dir
    
    log_success "服务器初始化完成！"
    echo ""
    echo "下一步："
    echo "1. 将项目文件上传到 /opt/smart-finance"
    echo "2. 配置环境变量文件 .env.production"
    echo "3. 运行部署脚本: ./deploy-production.sh"
    echo ""
    echo "注意：需要重新登录才能使Docker组权限生效"
}

main
