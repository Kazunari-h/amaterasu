<?php
class MisotenPDO extends PDO
{
    public function update($sql, $args)
    {
        $stmt = $this->prepare($sql);
        return $stmt->execute($args);
    }

    public function insertAnonymous($password)
    {
        $id = $this->insert('insert into accounts(password) values(?)', [$password]);
        return $this->cell('select account from accounts where id = ?', [$id]);
    }

    public function login($alias, $password)
    {
        $account = $this->cell('select account from accounts where alias = ? and password = ?', [$alias, $password]);
        return E::check($account, 'パスワードが正しくありません。');
    }

    public function whole($account)
    {
        return $this->select('select node, reffer, represent, dimension, content from nodes where node like ?', [$account.'%']);
    }

    public function insertNode($node, $reffer, $represent, $dimension, $content)
    {
        $id = $this->insert('insert into nodes(node, reffer, represent, dimension, content) values(?, ?, ?, ?, ?)', [$node, $reffer, $represent, $dimension, $content]);
        return $this->row('select * from nodes where id = ?', [$id]);
    }

    public function updateNode($node, $reffer, $represent, $dimension, $content)
    {
        $this->update('update nodes set reffer = ?, represent = ?, dimension = ?, content = ? where node = ?', [$reffer, $represent, $dimension, $content, $node]);
        return $this->row('select * from nodes where node = ?', [$node]);
    }

    public function insert($sql, $args)
    {
        $stmt = $this->prepare($sql);
        $stmt->execute($args);
        return $this->lastInsertId();
    }

    public function select($sql, $args)
    {
        $stmt = $this->prepare($sql);
        $stmt->execute($args);
        return $stmt->fetchAll();
    }

    public function row($sql, $args)
    {
        $stmt = $this->prepare($sql);
        $stmt->execute($args);
        return $stmt->fetch();
    }

    public function cell($sql, $args)
    {
        $stmt = $this->prepare($sql);
        $stmt->execute($args);
        return $stmt->fetch(PDO::FETCH_NUM)[0];
    }
}
