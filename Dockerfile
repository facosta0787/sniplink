FROM node:16.16.0
RUN npm install -g npm@9.2.0

ARG AT_APIKEY=${AT_APIKEY}
ARG AT_TABLEID=${AT_TABLEID}
ARG AT_SHEET=${AT_SHEET}
ARG LINK_DOMAIN=${LINK_DOMAIN}
ARG DATABASE_URL=${DATABASE_URL}
ARG SHADOW_DATABASE_URL=${SHADOW_DATABASE_URL}

ENV AT_APIKEY=${AT_APIKEY}
ENV AT_TABLEID=${AT_TABLEID}
ENV AT_SHEET=${AT_SHEET}
ENV LINK_DOMAIN=${LINK_DOMAIN}
ENV DATABASE_URL=${DATABASE_URL}
ENV SHADOW_DATABASE_URL=${SHADOW_DATABASE_URL}

EXPOSE 3000

WORKDIR /sniplink

COPY package*.json ./

RUN npm install --include=dev
COPY . .
RUN npx prisma generate
RUN npx prisma deploy

RUN npm run build

CMD ["npm", "start"]
