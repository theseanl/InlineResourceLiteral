var css_resource = "a[target=\"_blank\"]{display:block}";
var html_resource = "<style></style><div></div>";
var js_resource = (function() {
    var a = 1;
    let b = a + {};
})();
;
var json_resource = {"a":{"b":"c"},"d":1};

var css_computed_resource = "div{width:"+window.innerWidth+";height:"+window.innerHeight+"}";
var html_computed_resource = "<title>"+"title"+"</title><p>Injected value is: "+Math.random()+"";
var js_computed_resource = "class Settings {\\
    constructor() {\\
        this._settings = "+initial_settings+";\\
    }\\
    get settings() {\\
        return this._settings;\\
    }\\
    set settings(i) {\\
        this._settings = i;\\
    }\\
}\\
";

var non_existing_resource = RESOURCE_NONEXISTENT;

var js_computed_resource_buffer = "var key = "+"1"+";";
