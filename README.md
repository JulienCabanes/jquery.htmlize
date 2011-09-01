# DOM Serializer jQuery plugin
## What ?
```$.html()``` is not a DOM serializer, ```$.htmlize()``` is.
## How to use ?
```
$('#serialize-me').htmlize();
```

By default, it returns an ```outerHTML``` concatenation from node's clone because the plugin is playing with attributes. You can override this with the following options :

```
$('#serialize-me').htmlize({innerHTML: true, clone: false});
```