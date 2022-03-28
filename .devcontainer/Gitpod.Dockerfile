FROM gitpod/workspace-base
USER root

RUN apt update; apt install -y rsync

# Setup NeoVim
RUN mkdir -p /setup/nvim/
WORKDIR /setup/nvim
# Download and extract archive
RUN wget https://github.com/neovim/neovim/releases/download/stable/nvim-linux64.tar.gz
RUN tar -xzvf /setup/nvim/nvim-linux64.tar.gz
# Merge files into fs-root
RUN rsync /setup/nvim/nvim-linux64/* /

# Setup GitHub CLI
RUN mkdir -p /setup/gh/
WORKDIR /setup/gh
# Download and extract archive
RUN wget https://github.com/cli/cli/releases/download/v2.6.0/gh_2.6.0_linux_amd64.tar.gz
RUN tar -xzvf /setup/gh/gh_2.6.0_linux_amd64.tar.gz
# Merge files into fs-root
RUN rsync -a /setup/gh/gh_2.6.0_linux_amd64/* /

# Set up NVM
RUN mkdir -p /setup/nvm && chown -R gitpod:gitpod /setup/nvm
RUN su -l gitpod -c "curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh -o /setup/nvm/install.sh"
RUN su -l gitpod -c "chmod +x /setup/nvm/install.sh && /setup/nvm/install.sh"

# Install node and npm via nvm
RUN su -l gitpod -c ". /home/gitpod/.nvm/nvm.sh; nvm install v16.14.0; nvm use --delete-prefix v16.14.0"

# Cache project dependencies for faster installation during first startup
RUN su -l gitpod -c ". /home/gitpod/.nvm/nvm.sh; npm cache add @types/node @types/react @types/react-dom"
RUN su -l gitpod -c ". /home/gitpod/.nvm/nvm.sh; npm cache add react react-dom react-scripts typescript prettier axios"
RUN su -l gitpod -c ". /home/gitpod/.nvm/nvm.sh; npm cache add react-bootstrap bootstrap@5.1.3"
# Install default global packages
RUN su -l gitpod -c ". /home/gitpod/.nvm/nvm.sh; npm install -g typescript prettier"

# Clean up installation files
WORKDIR /
RUN rm -rfd /setup
