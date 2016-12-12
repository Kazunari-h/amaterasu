var conn;
var nodes = {};

Array.prototype._adjust = function (length)
{
    var ret = this.concat();
    ret.length = length;
    return ret;
};

$.fn.extend
(
    {
        _each: function (callback)
        {
            return this.map(function ()
            {
                callback.call($(this));
            });
        },
        __each: function (callback)
        {
            return function ()
            {
                var args = arguments;
                return this.map(function ()
                {

                });
            }
        }
        _map: function (callback)
        {
            return $.map(this, function ()
            {
                callback.call($(this));
            });
        },
        _append: function (str)
        {
            var ret = $(str);
            this.append(ret);
            return ret;
        },
        _before: function (str)
        {
            var ret = $(str);
            this.before(ret);
            return ret;
        },
        _serialize: function (target)
        {
            var ret = {};
            this.serializeArray().forEach(function (row)
            {
                ret[row['name']] = row['value'];
            });
            ret[target.name] = target.value;
            return ret;
        },
        _reflect: function ()
        {
            if(this.hasClass('li') || this.hasClass('td'))
            {
                var row = nodes[this.data('id')];
                if(row)
                {
                    this.text(row['content']).addClass('exist');
                }
                else
                {
                    this.removeClass('exist');
                }
            }
            else if(this.hasClass('tr'))
            {
                this._load();
            }
            else if(this.hasClass('ol'))
            {
                this._load();
            }
            else if(this.hasClass('table'))
            {
                this._load();
            }
            return this;
        },
        _data: function (key)
        {
            var id = this.data('id') || this.data('id');
            return nodes[id][key];
        },
        _child: function ()
        {
            if(this.hasClass('ol'))
            {
                return this._append('<div class="cell li">')
            }
            else if(this.hasClass('table'))
            {
                return this._append('<div class="tr">');
            }
            else if(this.hasClass('tr'))
            {
                return this._append('<div class="cell td">');
            }
        },
        _load: function (id, dim)
        {
            var array = id.split('_');
            var prefix = array._adjust(dim).join('_');
            var suffix = array.slice(dim).join('_');
            for(var i = 0; i < 26; i++)
            {
                this._child()._setid(prefix + String.fromCharCode(97 + i) + suffix)._reflect();
            }
        },
        _setid: function(id)
        {
            this.attr('id', id);
            this.data('id', id);
        },
        _hide: function ()
        {
            this.addClass('hide');
            this.find('*').attr('id', null);
            return this;
        },
        _expand: function ()
        {
            $('.hide').remove();
            var prevAll = this.prevAll();
            var ret = this._before("<div class='column'>").data('id', this.data('id')).addClass(this._data('represent'))._reflect();
            prevAll._hide();
            return ret;
        },
        _login: function ()
        {
            conn.send(JSON.stringify({type: 'login', position: this.attr('id'), alias: this.data('alias'), password: this.data('password')}));
        },
        _fill: function (id)
        {
            var _this = this;
            $.each(nodes[id], function(key, value)
            {
                _this.find('[name="' + key + '"]').val(value);
            });
            return this;
        },
        _modal: function ()
        {
            var ret = this.find('form');
            ret[0].reset();
            this.css('display', 'flex');
            return ret;
        }
    }
);

$(function ()
{
    for(var i = 0; i < 26; i++)
    {
        $('#root')._append('<div class="cell account">').attr('id', 'a-' + String.fromCharCode(97 + i));
    }
    conn = new WebSocket('ws://localhost:9000');
    conn.onopen = function ()
    {
        $('#a-a').data('password', Math.random().toString().slice(2))._login();
    };
    conn.onmessage = function (e)
    {
        var json = $.parseJSON(e.data);
        switch(json['type'])
        {
            case 'login':
                json['data'].forEach(function (row)
                {
                    nodes[row['node']] = row;
                });
                $('#' + json['position'])._setid('id', json['account']).text(json['alias'] || '(未登録)').addClass('exist');
            break;
            case 'signup':
            break;
            case 'insert':
                nodes[json['data']['node']] = json['data'];
                $('#' + json['data']['node'])._reflect();
                $('.modal').css('display', 'none');
            break;
            case 'update':
                nodes[json['data']['node']] = json['data'];
                $('#' + json['data']['node']).text();
                $('.modal').css('display', 'none');
            break;
            case 'delete':
                nodes[json['data']['node']] = null;
                $('#' + json['data']['node']).removeClass('exist');
                $('.modal').css('display', 'none');
            break;
            case 'error':
                alert(json['message']);
            break;
        }
    };
    conn.onerror = function ()
    {
        alert('error');
    };
    conn.onclose = function ()
    {
        alert('close');
    };
    $(document).on('click', '.column', function (e)
    {
        if ($(e.target).hasClass('exist'))
        {
            $(this)._expand();
        }
        else if($(e.target).hasClass('cell'))
        {

        }
    });
    $(document).on('contextmenu', '.column', function (e)
    {
        e.preventDefault();
        if($(e.target).hasClass('account'))
        {
            if($(e.target).hasClass('exist'))
            {
                $('#signup')._modal()._fill(nodes[$(e.target).attr('id')]);
            }
            else
            {
                $('#login')._modal();
            }
        }
        else if($(e.target).hasClass('cell'))
        {
            if($(e.target).hasClass('exist'))
            {
                $('#update')._modal()._fill($(e.target).attr('id'));
            }
            else
            {
                $('#insert')._modal().find("[name='node']").val($(e.target).attr('id'));
            }
        }
        return false;
    });
    $(document).on('click', 'form', function (e)
    {
        e.preventDefault();
        switch (e.target.type)
        {
            case 'submit':
                var data = {type: e.target.value};
                $(this).serializeArray().forEach(function (row)
                {
                    data[row['name']] = row['value'];
                });
                conn.send(JSON.stringify(data));
            break;
            case 'button':
                $('.modal').css('display', 'none');
            break;
        }
        return false;
    });
});
