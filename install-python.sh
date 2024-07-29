#!/bin/bash
set -e

# Install pyenv
curl https://pyenv.run | bash

# Add pyenv to PATH and initialize
export PATH="$HOME/.pyenv/bin:$HOME/.pyenv/shims:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"

# Install Python 3.9.6
pyenv install 3.9.6
pyenv global 3.9.6

# Verify Python installation
python --version

