## Docker Image

```
docker build --no-cache -t datimage .

docker run -d -p 1433:1433 --name dat datimage:latest

docker start dat
```