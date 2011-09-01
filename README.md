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
## Why ?
In order to create PDF export from the DOM via wkhtmltopdf I needed to serialize the DOM. The context was a Web App I'm still working on, running with Backbone.js, with lots of form elements and calculations, like spreadsheets…
So because of client-side templating and user interaction, what I needed wasn't the HTML sent by the server, but exactly the same DOM the user had in front of his eyes.
It quickly appears that ```element.innerHTML``` didn't fit my needs. If you use ```innerHTML``` in a form, you'd see that fields (```input```, ```textarea```, ```select```…) are badly serialized : some attributes aren't updated, ```value``` for instance but also ```disabled```, ```selected```…
I searched and tried many ways before writing this plugin : for instance the ```XMLSerializer``` Object, available on Firefox & Webkit browsers, but having the same problem than ```innerHTML```.
Without a solution after my researches, I thought a moment about traversing and serializing "by hand" every nodes, it sounded too bad so I just forgot about it and tried to find a smarter way. Thing is, ```innerHTML``` does work well **most** of the time…
