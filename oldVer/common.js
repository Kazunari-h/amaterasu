var conn;

$.fn.extend(
{
    _hide: function ()
    {
        $(this).css('margin-left', -this.outerWidth());
        return this;
    },
    _show: function ()
    {
        $(this).css('margin-left', 0);
        return this;
    },
    _get: function(url, data, callback)
    {
        $.get(url, data, callback.bind(this));
    },
    _post: function(url, data, callback)
    {
        $.post(url, data, callback.bind(this));
    },
    _getjson: function(url, data, callback)
    {
        $.getJSON(url, data, callback.bind(this));
    },
    _each: function (callback)
    {
        this.each(function ()
        {
            callback.call($(this));
        })
    },
    _foreach: function(array, callback)
    {
        array.forEach(callback.bind(this));
    },
    _append: function (str)
    {
        var _ret = $(str);
        this.append(_ret);
        return _ret;
    },
    _before: function (str)
    {
        var ret = $(str);
        this.before(ret);
        return ret;
    },
    _prev: function (str)
    {
        if(this.prev().length)
        {
            return this.prev();
        }
        else
        {
            return this._before(str);
        }
    },
    _getid: function ()
    {
        return this.get(0)._id;
    },
    _setid: function (id)
    {
        this.get(0)._id = id;
        return this;
    },
    _id: function (id)
    {
        return id === undefined? this._getid(): this._setid(id);
    },
    _getparent: function ()
    {
        return this.get(0).id;
    },
    _setparent: function (parent)
    {
        this.get(0).id = id;
        return this;
    },
    _parent: function (parent)
    {
        return parent === undefined? this._getparent(): this._setparent(parent);
    },
    _addcell: function (data)
    {
        this.append($('<div>').addClass('cell')._setid(data.id).text(data.content));
        return this;
    },
    _addcolumn: function (id)
    {
        this._before('<div>').addClass('column').css('margin-left', -this.outerWidth())._list(id);
    },
    _list: function ()
    {
        for(var i = 97; i < 123; i++)
        {
            map($(this).).replace('_', String.fromCharCode(i));
        };
    },
    _expand: function ()
    {
        $('.hide').remove();
        $(this).parent().prevAll().addClass('hide');
        $(this).parent()._before("<div class='columns'>")._list();
        return this;
    },
    _login: function ()
    {
        conn.send($.parseJSON({type: 'login', position: this.attr('id'), alias: this.data('alias'), password: this.data('password')}));
    }
});

$(function ()
{
    conn = new WebSocket('ws://localhost:9000');
    conn.onopen = function ()
    {
        $('.account')._each($()._login);
    }
    conn.onmessage = function (e)
    {
        var json = $.parseJSON(e.data);
        switch(json['type'])
        {
            case 'login':
                $('.' + json['position']).attr('name', 'node-' + json['account']);
                json['data'].forEach(function (row)
                {
                    $('.cell[name=' + json['node'] + ']')._expand();
                });
            break;
            case 'edit':
            break;
            case 'delete':
            break;
        }
    }
    $(document).on('contextmenu', '.account', function (e)
    {
        e.preventDefault();
        $('#login').css('display', 'flex');
        return false;
    });
    $(document).on('contextmenu', '.node', function (e)
    {
        e.preventDefault();
        $('#edit').css('display', 'flex');
        return false;
    });
    $(document).on('click', '.cancel', function (e)
    {
        e.preventDefault();
        $('.modal').css('display', 'none');
        return false;
    });
});
