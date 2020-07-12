#!/usr/bin/env php
<?php

    $description = "Cipher App in Elixir/Erlang";
	$arr = explode('/',__DIR__);
	array_pop($arr);
    $app = $arr[count($arr) - 1];
    $baseDir = '/var/www/elixir';
    
    $env = 'prod';
    if(null==$argv[1] || trim($argv[1]) != $env){
        $env = 'dev';
    } 
    
    shell_exec('sudo rm -rf make_release.sh');
    
    shell_exec('sudo rm -rf ./lib/app_configuration/enviroment/enviroment.decisor.ex');
    
    $f0 = fopen("./lib/app_configuration/enviroment/enviroment.decisor.ex", "w");
    fwrite($f0,"defmodule ExCipher.Enviroment.Decisor do\n");
    fwrite($f0,"\n");
    fwrite($f0,"  def getEnvType() do\n");
    fwrite($f0,"    \"" . $env . "\"\n");
    fwrite($f0,"  end\n");
    fwrite($f0,"\n");
    fwrite($f0,"end"); 
    fclose($f0);
    
    $f1 = fopen("./" . $app . ".service", "w");
	fwrite($f1,"[Unit]\n"); 
	fwrite($f1,"Description=" . $description . "\n"); 
	fwrite($f1,"After=mysql.service\n"); 
	fwrite($f1,"\n"); 
	fwrite($f1,"[Service]\n");
	fwrite($f1,"Environment=\"MIX_ENV=prod\" \"HOME=" . $baseDir . "/" . $app . "/ex_cipher/bin\"\n");
	fwrite($f1,"ExecStart=/usr/local/bin/" . $app . "_startup.sh\n");
	fwrite($f1,"ExecStop=/usr/local/bin/" . $app . "_shutdown.sh\n");
	fwrite($f1,"RemainAfterExit=yes\n");
	fwrite($f1,"\n");
	fwrite($f1,"[Install]\n");
	fwrite($f1,"# WantedBy=default.target\n"); 
	fwrite($f1,"WantedBy=multi-user.target");
	fclose($f1);
	
	$f2 = fopen("./" . $app . "_shutdown.sh", "w");
	fwrite($f2,"#!/bin/bash\n"); 
	fwrite($f2, $baseDir . "/" . $app  . "/ex_cipher/bin/ex_cipher stop"); 
	fclose($f2);
	
	$f3 = fopen("./" . $app . "_startup.sh", "w");
	fwrite($f3,"#!/bin/bash\n"); 
	fwrite($f3, $baseDir . "/" . $app . "/ex_cipher/bin/ex_cipher start"); 
	fclose($f3);
    
    $f4 = fopen("./"  . $app . "_init.sh", "w");
	fwrite($f4,"#!/bin/bash\n");
	fwrite($f4,"sudo cp " . $baseDir . "/" . $app . "/" . $app . "_startup.sh /usr/local/bin/" . $app . "_startup.sh\n"); 
	fwrite($f4,"sudo chmod 744 /usr/local/bin/" . $app . "_startup.sh\n"); 
	fwrite($f4,"sudo chmod +x /usr/local/bin/" . $app . "_startup.sh\n");
	fwrite($f4,"sudo cp " . $baseDir . "/" . $app . "/" . $app . "_shutdown.sh /usr/local/bin/" . $app . "_shutdown.sh\n"); 
	fwrite($f4,"sudo chmod 744 /usr/local/bin/" . $app . "_shutdown.sh\n"); 
	fwrite($f4,"sudo chmod +x /usr/local/bin/" . $app . "_shutdown.sh\n");
	fwrite($f4,"sudo cp " . $baseDir . "/" . $app . "/" . $app . ".service /etc/systemd/system\n"); 
	fwrite($f4,"sudo chmod 664 /etc/systemd/system/" . $app . ".service\n"); 
	fwrite($f4,"sudo chmod +x /etc/systemd/system/" . $app . ".service\n"); 
	fwrite($f4,"sudo systemctl daemon-reload\n"); 
	fwrite($f4,"sudo systemctl enable " . $app . ".service\n"); 
	fwrite($f4,"sudo systemctl restart " . $app . ".service"); 
	fclose($f4);
    
	$f5 = fopen("./make_release.sh", "w");
	fwrite($f5,"#!/bin/bash\n"); 
	fwrite($f5,"sudo rm -rf " . $baseDir . "/" . $app . "\n"); 
	fwrite($f5,"sudo rm -rf compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mkdir compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mix do deps.get, deps.compile, compile\n"); 
	fwrite($f5,"sudo MIX_ENV=prod mix release\n"); 
	fwrite($f5,"sudo cp -r _build/prod/rel/ex_cipher compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mv " . $app . ".service ./compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mv " . $app . "_startup.sh ./compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mv " . $app . "_shutdown.sh ./compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mv " . $app . "_init.sh ./compiled_" . $app . "\n"); 
	fwrite($f5,"sudo mv ./compiled_" . $app . " " . $baseDir . "/" . $app . "\n"); 
	fwrite($f5,"sudo chmod +x " . $baseDir . "/" . $app . "/" . $app . "_init.sh\n"); 
	fclose($f5);
	
	shell_exec('sudo chmod 774 make_release.sh');
	shell_exec('sudo chmod +x make_release.sh');
?>