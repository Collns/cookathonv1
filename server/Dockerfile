FROM node:18-alpine

# Create working directory
WORKDIR /app

# Copy dependency manifest
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend files
COPY . .

# Expose your API port
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]
