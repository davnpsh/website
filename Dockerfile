# This is for a builder container
# It just generates the static files for the website
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# build
CMD ["npm", "run", "build"]