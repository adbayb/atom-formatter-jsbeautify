# atom-formatter-jsbeautify
<br/>

Formatter plugin adding a js-beautify interface to the Atom editor.
This plugin can reformat and reindent your source code with a bunch of accepted file formats:

> **Javascript/JSON:** *.js, .jsx, .json* <br/><br/>
> **Css and its pre-processors:** *.css, .sass, .scss, .less* <br/><br/>
> **HTML/XML:** *.html, .xml* <br/>

<br/>
## Prerequisites:
<br/>
- [x] Install [Atom Formatter package](https://atom.io/packages/formatter)
- [x] Install this package ([atom-formatter-jsbeautify](https://atom.io/packages/atom-formatter-jsbeautify))
- [x] No more setup and no more package configurations are required. You are, now, good to go :)

<br/>
## Usage:
<br/>
### Keybindings:

It takes the default keybindings from Formatter. E.g, by default (you can customize these in the Atom keymap.cson):

```cson
'atom-text-editor':
  'alt-ctrl-l': 'formatter:format-code'
  'alt-cmd-l': 'formatter:format-code'
```

### Configurations:

By default, it loads configurations from .jsbeautifyrc file. **This file must be located in the root of your project folder to be taken into account.**<br/>
Whenever the file isn't found, an error popup will be displayed. The code will then be beautified thanks to the default js-beautify configurations.

The config file must be valid JSON and looks like the one supported by js-beautify itself:

```json
{
	"comment": "Configurations for [js, jsx, json] and Shared configurations",

	"brace_style": "collapse-preserve-inline",
	"break_chained_methods": false,
	"comma_first": false,
	"e4x": true,
	"end_with_newline": true,
	"eol": "\n",
	"eval_code": false,
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"indent_size": 4,
	"indent_char": " ",
	"indent_level": 0,
	"indent_with_tabs": true,
	"jslint_happy": false,
	"max_preserve_newlines": 10,
	"preserve_newlines": true,
	"space_after_anon_function": false,
	"space_before_conditional": false,
	"space_in_paren": false,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"wrap_line_length": 0,
	"unescape_strings": false,


	"comment": "Configurations for [css] and its pre-processors [sass, scss, less]",

	"newline_between_rules": true,
	"selector_separator_newline": false,


	"comment": "Configurations for [html, xml]",

	"extra_liners": ["head", "body", "/html"],
	"indent_inner_html": true,
	"indent_scripts": "normal",
	"unformatted": ["inline"]
}
```

For more descriptions about available configuration options and their impacts to beautification process:<br/>
[JSON Schemastore](http://json.schemastore.org/jsbeautifyrc)<br/>
[JSBeautify](https://github.com/beautify-web/js-beautify)

<br/>
## License
<br/>
[MIT](./LICENSE "License MIT")
