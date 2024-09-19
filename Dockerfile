# Use Node.js v21 official runtime image
FROM node:21-alpine

# Install necessary dependencies for Puppeteer or Chrome
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  libx11 \
  libxcomposite \
  libxdamage \
  libxrandr \
  libxtst \
  libxshmfence \
  alsa-lib \
  libvpx \
  libwebp \
  # Optional but useful for Puppeteer
  xvfb-run \
  dumb-init

  
# Set environment variables for Puppeteer and Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

# Add a non-privileged user
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Switch to non-privileged user
USER pptruser

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY --chown=pptruser:pptruser package*.json ./

# Install app dependencies including NestJS CLI
RUN npm install

# Copy the rest of the application source code
COPY --chown=pptruser:pptruser . .

# Build the application (ensure 'dist' folder is generated)
RUN npm run build

# Expose port if your app uses one (e.g., 3000)
EXPOSE 3000

# Start the server using the production build
# CMD [ "npm", "run", "start:prod" ]

CMD [ "node", "dist/src/main.js" ]

