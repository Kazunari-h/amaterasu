<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link href="./common.css" rel="stylesheet" type="text/css" />
        <script src="./jquery.js" type="text/javascript"></script>
        <script src="./common.js" type="text/javascript"></script>
    </head>
    <body>
        <div class="column ol" id="root"></div>
        <div id="void"></div>
        <div id="enhelp"><div><span>help</span></div></div>
        <div class="modal" id="login">
            <form>
                account<input type="text" name="account" />
                password<input type="password" name="password" />
                <button type="submit" name="type" value="login">login</button>
                <button type="button" name="type" value="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="signup">
            <form>
                account<input type="text" name="account" />
                password<input type="password" name="password" />
                <button type="submit" name="type" value="signup">signup</button>
                <button type="button" name="type" value="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="insert">
            <form>
                <input type="hidden" name="node" />
                represent<select name="represent"><option value="ol">リスト</option><option value="table">表</option></select>
                dimension<select name="dimension"><option value="1">1</option><option value="2">2</option></select>
                content<input type="text" name="content" />
                <button type="submit" name="type" value="insert">insert</button>
                <button type="button" name="type" value="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="update">
            <form>
                <input type="hidden" name="node" />
                represent<select name="represent"><option value="ol">リスト</option><option value="table">表</option></select>
                dimension<select name="dimension"><option value="1">1</option><option value="2">2</option></select>
                content<input type="text" name="content" />
                <button type="submit" name="type" value="update">update</button>
                <button type="submit" name="type" value="delete">delete</button>
                <button type="button" name="type" value="reffer">reffer</button>
                <input type="text" name="reffer" disabled />
                <button type="button" name="type" value="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="help">
            <form>
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                <button type="button" name="type" value="cancel">cancel</button>
            </form>
        </div>
        <div id="toast">
            aaaaaa
        </div>
    </body>
</html>