<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;

require __DIR__.'/vendor/autoload.php';
require 'pdoLocal.php';
require 'e.php';
require 'clients.php';

class Chat implements MessageComponentInterface
{
    protected $pdo;
    protected $clients;

    public function __construct()
    {
        $this->pdo = new MisotenPDOLocal();
        $this->clients = new Clients();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients[$conn] = [];
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        try
        {
            $this->pdo->beginTransaction();
            $json = json_decode($msg, true);
            $this->clients->check($from, $json);
            switch ($json['type'])
            {
                case 'login':
                    $account = isset($json['alias'])?
                        $this->pdo->login($json['alias'], $json['password']):
                        $this->pdo->insertAnonymous($json['password']);
                    $this->clients->push($from, $account);
                    $data = $this->pdo->whole($account);
                    $from->send(json_encode(['type'=>'login', 'position'=>$json['position'], 'account'=>$account, 'data'=>$data]));
                break;/*
                case 'signup':
                break;*/
                case 'insert':
                    $account = substr($json['node'], 0, 11);
                    $data = $this->pdo->insertNode($json['node'], $json['reffer'], $json['represent'], $json['dimension'], $json['content']);
                    $this->clients->send($account, json_encode(['type'=>'insert', 'data'=>$data]));
                break;
                case 'update':
                    $account = substr($json['node'], 0, 11);
                    $data = $this->pdo->updateNode($json['node'], $json['reffer'], $json['represent'], $json['dimension'], $json['content']);
                    $this->clients->send($account, json_encode(['type'=>'insert', 'data'=>$data]));
                break;
            }
            $this->pdo->commit();
        }
        catch (E $e)
        {
            $from->send(json_encode(['type'=>'error', 'message'=>$e->getMessage()]));
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        unset($this->clients[$conn]);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        error_log($e->getMessage());
        $conn->close();
    }
}
$server = IoServer::factory(new HttpServer(new WsServer(new Chat())), 9000);
$server->run();