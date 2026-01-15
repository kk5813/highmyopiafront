docker build -t highmyopia-front-app:1.0 .
#{
#  "builder": {
#    "gc": {
#      "defaultKeepStorage": "20GB",
#      "enabled": true
#    }
#  },
#  "experimental": false,
#  "registry-mirrors": [
#    "https://docker.m.daocloud.io"
#  ]
#}
# docker run -d -p 8080:8080 --restart=always -v /opt/resources/images:/opt/resources/images --name front