FROM node:16

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install additional packages explicitly
RUN npm install @emotion/styled @emotion/react react-router-dom

COPY . .

CMD ["npm", "start"] 