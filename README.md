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
## First idea
So, I started to play with DOM nodes and see how ```innerHTML``` behaves when attributes are changing. It seems like only fields are problematics and only some attributes, I guessed the cause was the way of browsers are making them, like iframes or whatever. I also found that the ```value``` attribute doesn't behave the same depending on the input's type.
For instance with a text field, the ```value``` is not updated in ```innerHTML```, but it is with checkboxes ! It kind of makes sense for me, browsers doesn't need to reflow checkboxes when the value changes, but it does with text fields. So I tried with the ```checked``` attribute, my guess was write : as checkbox needs reflow when checked/unchecked, this attribute wasn't update in ```innerHTML```.
My first hack idea was almost there : storing a copy of those **risky** attributes in **safety** attribute so I decided to go with ```data-\*```. As I know which attributes from which nodes were problematics, I should just select those nodes, get those attributes, back them up, escaping them from ```innerHTML``` and restore them from ```data-\*```.
## Less speaking, more code.
Let's say we have an input field with default value to "foo". I use ```outerHTML``` for better comprehension, but it doesn't work on Firefox, just sayin'…

```input.outerHTML === '<input value="foo">';```

The user changes it to bar.
```input.outerHTML === '<input value="foo">';```
but
```input.value === 'bar';```

Backup the risky attribute to a safety attribute
```input.innerHTML === '<input value="foo" data-backup-value="bar">';```

One RegExp later
```<input data-backup-value="bar">```

Another RegExp later
```<input value="bar">```

And here it is ! Good serialization.
Things could have been easier but here are two more things I needed to do :
* Doing the hack on a clone node rather than the node itself as I'm adding some extra attributes.
* Handle the ```textarea``` special case : ```value``` and ```innerHTML``` are very closed but different. Only the ```value``` property is changing, not the ```innerHTML``` so it needs ```this.innerHTML = this.value;```
## Better, Faster, Stronger, Easier…
While writing this README, I made some other tests… I discovered that it isn't only because of the attributes kind, it's also the way of setting them ! Actually, it's a story about attributes and properties, anyway…

```
input.outerHTML === '<input value="foo">';
input.value = 'bar';
input.outerHTML === '<input value="foo">';
input.setAttribute('value', 'foobar');
input.outerHTML === '<input value="foobar">';
```

The weird thing is…
```input.value === 'bar';```

But we don't care ! We only need to do :
```input.setAttribute('value', input.value);```

Actually, it's just like resyncing the attributes : no more ```RegExp```, no more ```data-\*``` attributes tricks, only resyncing.
So that's the 2nd idea and current implementation : resyncing.
I kept the clone abstraction because in some case you could need to access the initial attributes, as default values references for instance.
Hope it would help !
