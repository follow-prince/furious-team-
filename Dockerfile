# Dockerfile for Node/serve

# --- Stage 1: Build the React Application ---
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- Stage 2: Serve the Application using Node ---
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/build ./build
COPY package*.json ./

# Install ONLY production dependencies and the 'serve' package
# Note: We are not copying node_modules from the builder.
# We run a clean install of only production dependencies.
RUN npm install --production

# Install serve globally within the container
RUN npm install -g serve

# Expose the port that 'serve' will run on
EXPOSE 3000

# The command to start the server.
# The '-s' flag tells serve to handle all routes by redirecting to index.html,
# which is perfect for single-page applications.
CMD [ "serve", "-s", "build", "-l", "3000" ]