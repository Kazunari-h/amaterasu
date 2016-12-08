<?php
class E extends Exception
{
    public function __construct($message)
    {
        parent::__construct($message, 0, null);
    }

    public static function check($arg, $msg)
    {
        if($arg)
        {
            return $arg;
        }
        else
        {
            throw new self($msg);
        }
    }
}