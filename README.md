# Workshop nodejs + pm2

https://github.com/mezaleo/nodejs-pm2.git


## Setup

Instalar npm
```sh
apk add --update nodejs npm
```
Mover a directorio jwt-service
```sh
cd jwt-service
```
Instalar dependencias
```sh
npm i
```
Instalar pm2
```sh
npm install pm2 -g
```
## Iniciar procesos administrados

```sh
pm2 start ecosystem.config.js
```
## Listar procesos administrados

```sh
pm2 list
```
## Detener procesos

```sh
pm2 stop ecosystem.config.js
```

## Administrar solo un proceso

```sh
pm2 stop ecosystem.config.js --only jwt-service
```