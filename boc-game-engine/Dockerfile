# Use Node.js LTS version
FROM node:lts

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
