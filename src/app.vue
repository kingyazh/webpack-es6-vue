<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <script>
        function adapt(e, t) {
            var n = window.document.createElement("div");
            return n.style.width = "1rem",
                n.style.display = "none",
                window.document.getElementsByTagName("head")[0].appendChild(n),
                parseFloat(window.getComputedStyle(n, null).getPropertyValue("width"))
        }
        !function(e, t, n, d) {
            var i = e.documentElement
                , o = adapt(750, 100)
                , a = "orientationchange"in window ? "orientationchange" : "resize"
                , r = function() {
                var n = t.innerWidth || e.documentElement.clientWidth || e.body.clientWidth;
                n && (i.style.fontSize = n < 750 ? n / 750 * 100 / o * 100 + "%" : "625%")
            };
            e.addEventListener && (t.addEventListener(a, r, !1),
                e.addEventListener("DOMContentLoaded", r, !1))
        }(document, window)
    </script>
    <title>spa app title</title>
</head>

<body>
<div id="app">
    <h1 class="header_title">Hello App!</h1>
    <p>
        <router-link to="/pageA">pageA</router-link>
        <router-link to="/pageB">pageB</router-link>
        <router-link to="/foo">Go to Foo</router-link>
        <router-link to="/bar">Go to Bar</router-link>
    </p>
    <router-view></router-view>
</div>
</body>

</html>