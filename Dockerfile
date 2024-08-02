# Use the official Python image from the Docker Hub
FROM python:3.12.4-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-venv \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Verify Node.js and npm installation
RUN node -v
RUN npm -v

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment and install yt-dlp
RUN /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install yt-dlp

# Set the PATH to use the virtual environment's Python and pip
ENV PATH="/opt/venv/bin:$PATH"

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
