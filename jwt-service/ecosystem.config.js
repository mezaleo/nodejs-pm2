module.exports = {
    "apps" : [{
      "script"    : "./bin/www",
      "instances" : "max",
      "exec_mode" : "cluster",
      "cwd" : "./" ,
      "env": {"NODE_ENV" : "qa"},
      "name" : "jwt-service"
    }]
  };