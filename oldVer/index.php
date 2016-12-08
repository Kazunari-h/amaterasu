<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link href="common.css" rel="stylesheet" type="text/css" />
        <script src="../jquery.js" type="text/javascript"></script>
        <script src="../js.cookie.js" type="text/javascript"></script>
        <script src="common.js" type="text/javascript"></script>
    </head>
    <body>
        <form id="tree">
            <input class="open" type="radio" checked />
            <div class="columns">
                <div class="column">
                    <label class="cell account ready position-a" data-password="<?php echo base64_encode(random_bytes(9)); ?>"></label>
                    <label class="cell account ready position-b"></label>
                    <label class="cell account ready position-c"></label>
                    <label class="cell account ready position-d"></label>
                    <label class="cell account ready position-e"></label>
                    <label class="cell account ready position-f"></label>
                    <label class="cell account ready position-g"></label>
                    <label class="cell account ready position-h"></label>
                </div>
            </div>
            <input class="open position-a" type="radio" />
            <div class="columns position-a">
                <div class="column position-a">
                </div>
            </div>
        </form>
        <div class="modal" id="insert">
            <form>
                <input type="text" name="content" />
                <select name="type">
                    <option value=""></option>
                    <option value=""></option>
                </select>
                <input type="submit" name="type" value="edit" />
                <button class="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="update">
            <form>
                <input type="text" name="content" />
                <select name="type">
                    <option value=""></option>
                    <option value=""></option>
                </select>
                <input type="submit" name="type" value="edit" />
                <button class="cancel">cancel</button>
                <button class="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="login">
            <form>
                <input type="text" name="account" />
                <input type="password" name="password" />
                <input type="submit" name="type" value="login" />
                <button class="cancel">cancel</button>
            </form>
        </div>
        <div class="modal" id="signup">
            <form>
                <input type="text" name="account" />
                <input type="password" name="password" />
                <input type="submit" name="type" value="signup" />
                <button class="cancel">cancel</button>
            </form>
        </div>
    </body>
</html>