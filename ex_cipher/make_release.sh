#!/bin/bash
sudo rm -rf /var/www/elixir/elixir_cipher
sudo rm -rf compiled_elixir_cipher
sudo mkdir compiled_elixir_cipher
sudo mix do deps.get, deps.compile, compile
sudo MIX_ENV=prod mix release
sudo cp -r _build/prod/rel/ex_cipher compiled_elixir_cipher
sudo mv elixir_cipher.service ./compiled_elixir_cipher
sudo mv elixir_cipher_startup.sh ./compiled_elixir_cipher
sudo mv elixir_cipher_shutdown.sh ./compiled_elixir_cipher
sudo mv elixir_cipher_init.sh ./compiled_elixir_cipher
sudo mv ./compiled_elixir_cipher /var/www/elixir/elixir_cipher
sudo chmod +x /var/www/elixir/elixir_cipher/elixir_cipher_init.sh
