# Deployment
## Login
  docker login -u kanghcmut
  qnvn2101@

## Create folder
  mkdir datntvpl
  cd datntvpl

## Pull images
  sudo docker pull kanghcmut/lvtn-frontend-app:latest
  sudo docker pull kanghcmut/lvtn-backend-app:latest

## Crate compose and env files
  sudo nano docker-compose.yml 
   <!-- Add content and save -->
  sudo nano .env
   <!-- Add content and save -->

## Up compose
  sudo docker compose up

## Down compose
  sudo docker compose down

## Login with web_admin
  {
    "email": "qnvn2101@gmail.com",
    "password": "123456Ab"
  }

## Note:
  fe port: 3000
  be port: 5000
  using http instead of https

## Install package
  install package if needed inside the Dockerfile