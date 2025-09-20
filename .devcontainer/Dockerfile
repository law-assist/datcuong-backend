# Setup container environment for FE
FROM node:24-alpine

# Install git and bash for rum cmd in actions
RUN apk add --no-cache \
    git \
    bash

# Cài đặt các dependencies cần thiết cho Puppeteer hoặc Chrome
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
  xvfb-run \
  dumb-init

# Thiết lập các biến môi trường cho Puppeteer và Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

ENV PORT=29003

# Đảm bảo binary Chromium có quyền thực thi
RUN chmod 755 /usr/bin/chromium-browser

# Dev Environment:
    # Alpine linux distro: ✅
    # Node: ✅ (v.21)
    # Git: ✅
    # Bash: ✅
    # Chrome: ✅
    # Puppeteer dependencies: ✅