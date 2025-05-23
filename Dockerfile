FROM node:16.14.0-alpine
WORKDIR /app
COPY package*.json ./

# COPY prisma ./prisma/

# COPY nodemon.json ./nodemon.json

COPY .env ./.env

# COPY tsconfig.json ./

COPY . ./

# RUN npm install -g pnpm
# RUN pnpm install

RUN npm install 

CMD ["npm", "start" ]