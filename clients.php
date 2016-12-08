<?php
use Ratchet\ConnectionInterface;

class Clients extends SplObjectStorage
{
    public function send($account, $message)
    {
        foreach ($this as $conn)
        {
            if(in_array($account, $this[$conn]))
            {
                $conn->send($message);
            }
        }
    }

    public function push(ConnectionInterface $conn, $account)
    {
        $accounts = $this[$conn];
        array_push($accounts, $account);
        $this[$conn] = $accounts;
    }

    public function check(ConnectionInterface $from, $json)
    {/*
        if(isset($json['node']))
        {
            substr($json['node'], 0, 11);
        }
        else if ()*/
    }
}