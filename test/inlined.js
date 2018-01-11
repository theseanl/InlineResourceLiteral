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
var js_computed_resource = "class Settings {\n\
    constructor() {\n\
        // A comment\n\
        this._settings = "+initial_settings+";\n\
    }\n\
    get settings() {\n\
        return this._settings;\n\
    }\n\
    set settings(i) {\n\
        this._settings = i;\n\
    }\n\
}\n\
";

var non_existing_resource = RESOURCE_NONEXISTENT;

var js_resource_buffer = (function() { return 0; })();
var js_computed_resource_buffer = "var key = "+"1"+";";
