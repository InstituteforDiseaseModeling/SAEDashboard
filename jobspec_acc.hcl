variable "domain_acc" {
  type        = string
  description = "The application's acceptance domain."
}

job "__REPO__NAME__-acc" {
  region      = "us-west-2"
  datacenters = ["dc1"]
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

  group "__REPO__NAME__-acc" {
    count = 2
    network {
      mode = "bridge"
      port "http" { to = 80 }
      port "service" { to = 5000 }
    }

    service {
      name = "__REPO__NAME__-service-acc"
      port = "service"
      provider = "nomad"
    }

    service {
      name = "__REPO__NAME__-client-acc"
      port = "http"
      provider = "nomad"
      
        tags = [
        "traefik.enable=true",
        "traefik.http.routers.__REPO__NAME__-acc.rule=Host(`${var.domain_acc}`)",
        "traefik.http.routers.__REPO__NAME__-acc.entrypoints=https",
        "traefik.http.routers.__REPO__NAME__-acc.tls=true",
        #"traefik.http.services.__REPO__NAME__-acc.loadbalancer.sticky=false",
        #"traefik.http.services.__REPO__NAME__-acc.loadbalancer.sticky.cookie.secure=true",
        #"traefik.http.services.__REPO__NAME__-acc.loadbalancer.sticky.cookie.httpOnly=true"
      ]
      
    }

    task "__REPO__NAME__-service-acc" {
      driver = "docker"

      env {
        FLASK_ENV = "staging"
      }

      resources {
        cpu  = 2000
        memory = 4000
      }

      config {
        image = "bmgfsre.azurecr.io/__REPO__NAME___service:__BUILD__NUMBER__"
        ports = ["service"]
      }
    }

    task "__REPO__NAME__-client-acc" {
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