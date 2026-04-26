FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN chown -R node:node /app
USER node

RUN npm install

COPY . .
## If permissions errors of /app/src occurs, change to this :
#    COPY --chown=node:node . .
##

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# RUN npm run type-check
RUN npm run build

EXPOSE 3003

CMD ["npm", "run", "start"]