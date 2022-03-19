FROM mcr.microsoft.com/vscode/devcontainers/base:0-buster

# Setup NeoVim
RUN mkdir -p /setup/nvim/
WORKDIR /setup/nvim
# Download and extract archive
RUN wget https://github.com/neovim/neovim/releases/download/stable/nvim-linux64.tar.gz
RUN tar -xzvf /setup/nvim/nvim-linux64.tar.gz
# Merge files into fs-root
RUN cp -r /setup/nvim/nvim-linux64/* /

# Set up NVM
RUN mkdir -p /setup/nvm && chown -R vscode:vscode /setup/nvm
RUN su -l vscode -c "curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh -o /setup/nvm/install.sh"
RUN su -l vscode -c "chmod +x /setup/nvm/install.sh && /setup/nvm/install.sh"

# Install node and npm via nvm
RUN su -l vscode -c ". /home/vscode/.nvm/nvm.sh; nvm install v16.14.0; nvm use --delete-prefix v16.14.0"

# Cache project dependencies for faster installation during first startup
RUN su -l vscode -c ". /home/vscode/.nvm/nvm.sh; npm cache add @types/node @types/react @types/react-dom"
RUN su -l vscode -c ". /home/vscode/.nvm/nvm.sh; npm cache add react react-dom react-scripts typescript prettier"
# Install default global packages
RUN su -l vscode -c ". /home/vscode/.nvm/nvm.sh; npm install -g typescript prettier"

# Clean up installation files
WORKDIR /
RUN rm -rfd /setup