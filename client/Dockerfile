# --- Stage 1: Build ---
FROM node:18-alpine AS build
WORKDIR /app

# Copy only dependency files first (for caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the production files
RUN npm run build

# --- Stage 2: Run with Nginx ---
FROM nginx:alpine

# Copy built app to nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
