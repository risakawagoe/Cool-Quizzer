# Use an official Node runtime as a base image
FROM node:14-alpine as build

ARG FILE_SERVICE_ENDPOINT
ARG QUIZ_SERVICE_ENDPOINT
ENV REACT_APP_FILE_SERVICE_ENDPOINT=${FILE_SERVICE_ENDPOINT}
ENV REACT_APP_QUIZ_SERVICE_ENDPOINT=${QUIZ_SERVICE_ENDPOINT}

# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install --silent
# Copy the entire project to the working directory
COPY . .
# Build the React app
RUN npm run build
# Production environment
FROM nginx:alpine
# Copy build files to Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 to the outside world
EXPOSE 80
# Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]