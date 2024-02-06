FROM node:18

WORKDIR /simulation

# COPY scooter.js scooters.json .
# COPY scooter.js scooters.json scooter-handler.js .
# COPY scooter.js scooters.json scooter-handler.js ../server/loadDB.js .
# COPY scooter.js scooters.json scooter-handler.js ../server/loadDB.js ./

EXPOSE 1338

CMD ["node", "scooter-handler.js"]
# CMD ["node", "test-db.js"]



# FROM node:18

# WORKDIR /simulation

# RUN cp ../server/loadDB.js ./
# RUN cp ../server/models/* ./

# CMD ["node", "scooter-handler.js"]