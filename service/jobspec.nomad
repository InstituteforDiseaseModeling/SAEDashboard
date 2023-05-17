variable "domain_prod" {
  type        = string
  description = "The application's production domain."
}

job "__REPO__NAME__" {
  region      = "az-us"
  datacenters = ["us-west-2"]
  type        = "service"
  namespace   = "__NAMESPACE__"

  constraint {
    attribute = attr.kernel.name
    value     = "linux"
  }

  constraint {
    attribute = node.class
    value     = "spot"
  }

  group "__REPO__NAME__" {
    count = 1
    network {
      mode = "bridge"
      port "http" { to = 80 }
      port "service" { to = 5000 }
    }

    consul {
      namespace = "__NAMESPACE__"
    }

    service {
      name = "__REPO__NAME__-service"
      port = "service"
    }

    service {
      name = "__REPO__NAME__-client"
      port = "http"
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.__REPO__NAME__.rule=Host(`${var.domain_prod}`)",
        "traefik.http.routers.__REPO__NAME__.entrypoints=https",
        "traefik.http.routers.__REPO__NAME__.tls=true",
        "traefik.http.services.__REPO__NAME__.loadbalancer.sticky=true",
        "traefik.http.services.__REPO__NAME__.loadbalancer.sticky.cookie.secure=true",
        "traefik.http.services.__REPO__NAME__.loadbalancer.sticky.cookie.httpOnly=true"
      ]
    }

    task "__REPO__NAME__-service" {
      driver = "docker"

      env {
        FLASK_ENV = "staging"
      }

      resources {
        cpu    = 1000
        memory = 2000
      }

      config {
        image = "bmgfsre.azurecr.io/__REPO__NAME___service:__BUILD__NUMBER__"
        ports = ["service"]
      }
    }

    task "__REPO__NAME__-client" {
      driver = "docker"

      env {
        REACT_APP_SERVICE = "service"
      }

      config {
        image = "bmgfsre.azurecr.io/__REPO__NAME___client:__BUILD__NUMBER__"
        ports = ["http"]
        # args = [
        #   "GENERATE_SOURCEMAP=true"
        # ]
      }
    }
  }
}