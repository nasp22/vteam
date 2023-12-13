FROM node:18

WORKDIR /webbapp

COPY package*.json .

# Copying all the files in our project except .dockerignore
COPY . .

RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Starting our application
CMD ["npm","start"]
