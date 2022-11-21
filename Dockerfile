
FROM node:18-alpine AS builder
# Add a work directory
WORKDIR /100ms-web

# Copy app files
COPY . .

RUN yarn install

ENV NODE_ENV production

# set environment variables.
# These are the bare minimum needed for running
# the app. Feel free to add more as per your needs.
ENV REACT_APP_TILE_SHAPE=1-1
ENV REACT_APP_THEME=dark
ENV REACT_APP_COLOR=#2F80FF
ENV REACT_APP_LOGO='provide your logo img url here'
ENV REACT_APP_FONT=Inter
ENV REACT_APP_ENABLE_HLS_QUALITY_LVL='true'
ENV REACT_APP_TOKEN_GENERATION_ENDPOINT='<Your token generation endpoint from dashboard goes here>'
ENV REACT_APP_ENV=prod
ENV REACT_APP_LOGROCKET_ID='<Your Logrocket project ID>'
ENV REACT_APP_POLICY_CONFIG=''
ENV REACT_APP_DEFAULT_APP_DETAILS='{}'
ENV REACT_APP_ENABLE_STATS_FOR_NERDS='false'
ENV REACT_APP_PUSHER_APP_KEY=''
ENV REACT_APP_PUSHER_AUTHENDPOINT=''
ENV REACT_APP_HEADLESS_JOIN='false'

# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.23.1-alpine AS production
# Copy built assets from builder
COPY --from=builder /100ms-web/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]

