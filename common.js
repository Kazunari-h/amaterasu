var conn;
var nodes = {};
var reffersource;
var reffertype;

Array.prototype._adjust = function (length)
{
    var ret = this.concat();
    ret.length = length;
    return ret;
};

Function.prototype._map = function (thisArg, args)
{
    var _this = this;
    return $.map(thisArg, function(val)
    {
        return _this.apply($(val), args);
    });
};

$.fn.extend
(
    {
        _each: function (callback)
        {
            return this.map(function ()
            {
                return callback.call($(this));
            });
        },
        __each: function (callback)
        {
            var _this = this;
            return function ()
            {
                var args = arguments;
                return _this.map(function ()
                {
                    return callback.apply($(this), args);
                });
            };
        },
        _map: function (callback)
        {
            return $.map(this, function (val)
            {
                return callback.call($(val));
            });
        },
        __map: function (callback)
        {
            var _this = this;
            return function ()
            {
                var args = arguments;
                return $.map(_this, function (val)
                {
                    return callback.apply($(val), args);
                });
            };
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
                if(nodes[this.data('id')])
                {
                    if(this.hasClass('designed'))
                    {
                        this.text(this._data('content', 'a')).addClass('exist');
                    }
                    else
                    {
                        this.text(this._data('content')).addClass('exist');
                    }
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
                this.addClass('max-' + String.fromCharCode(97 + Math.max.apply(null, $.fn.data._map(this.find('.td.exist'), ['ord']))));
            }
            return this;
        },
        _data: function (key, sub)
        {
            var row = nodes[this.data('id') + (sub || '')];
            if(row)
            {
                return row[key];
            }
            else
            {
                return null;
            }
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
        _load: function ()
        {
            var array = this.data('id').split('_');
            var prefix = array._adjust(this._data('dimension') || 1).join('_');
            var suffix = array.slice(this._data('dimension') || 1).join('_');
            for(var i = 0; i < 26; i++)
            {
                this._child()._setid(prefix + String.fromCharCode(97 + i) + suffix).data('ord', i)._reflect();
            }
        },
        _setid: function(id)
        {
            this.attr('id', id);
            this.data('id', id);
            return this;
        },
        _hide: function ()
        {
            this.addClass('hide');
            this.find('*').attr('id', null);
            return this;
        },
        _expand: function ()
        {
            return $("<div class='column'>").data('id', this.data('id')).addClass(this._data('represent'));
        },
        _login: function ()
        {
            conn.send(JSON.stringify({type: 'login', position: this.attr('id'), alias: this.data('alias'), password: this.data('password')}));
        },
        _fill: function (id)
        {
            var _this = this;
            this.data('id', id);
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
        var node = $('#' + json['data']['node']);
        var modal = $('.modal');
        switch(json['type'])
        {
            case 'login':
                json['data'].forEach(function (row)
                {
                    nodes[row['node']] = row;
                });
                $('#' + json['position'])._setid(json['account']).text(json['alias'] || '(未登録)').addClass('exist');
            break;
            case 'signup':
                modal.css('display', 'none');
            break;
            case 'insert':
                nodes[json['data']['node']] = json['data'];
                node._reflect();
                modal.css('display', 'none');
            break;
            case 'update':
                nodes[json['data']['node']] = json['data'];
                node.text();
                modal.css('display', 'none');
            break;
            case 'delete':
                nodes[json['data']['node']] = null;
                node.removeClass('exist');
                modal.css('display', 'none');
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
            $('.hide').remove();
            var prevAll = $(this).prevAll();
            $(this)._before($(e.target)._expand())._reflect();
            prevAll._hide();
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
                if(reffersource)
                {
                    conn.send(JSON.stringify(
                    {
                        type: reffertype,
                        node: reffersource,
                        reffer: $(e.target).data('id')
                    }));
                }
                else
                {
                    $('#signup')._modal()._fill(nodes[$(e.target).attr('id')]);
                }
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
        if(e.target.type == 'submit')
        {
            var data = {type: e.target.value};
            $(this).serializeArray().forEach(function (row)
            {
                data[row['name']] = row['value'];
            });
            conn.send(JSON.stringify(data));
        }
        else if(e.target.value == 'cancel')
        {
            $('.modal').css('display', 'none');
        }
        else if(e.target.value == 'reffer')
        {
            reltarget = $(this).data('id');
            reltype = e.target.value;
            $('.modal').css('display', 'none');
        }
        return false;
    });
});
