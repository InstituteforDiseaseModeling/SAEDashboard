#!/usr/bin/env bash

cd /app

case $1 in
  start)
    # The '| cat' is to trick Node that this is an non-TTY terminal
    # then react-scripts won't clear the console.
    yarn start | cat
    ;;
  build)
    yarn build
    ;;
  test)
    yarn test $@
    ;;
  *)
    exec "$@"
    ;;
esac
