# nopyprompt README

NoPyPrompt is a simple VS Code extension so remove >>> Python prompts from code examples, or to add them.

## Features

For example:

```pycon
>>> def cube(x):
...     return x**3
...
>>> cube(5)
125
>>> a = "Hello World"
>>> print(a)
Hello World
```

is converted to:

```python
def cube(x):
    return x**3

cube(5)
#> 125

a = "Hello World"
print(a)
#> Hello World
```

And vice versa.

Just select the code and press Ctrl-Shift-, (or Cmd-Shift-, on MacOS). Alternatively, you can select "NoPyPrompt: Toggle Python Prompt >>>" from the command palette.

## Known Issues

* Multiple contiguous selections are treated separately.
* In particular, this means that you should avoid rectangular selections, or else each line will be treated independently.

## Release Notes

### 1.0.0

Initial release of NoPyPrompt.

**Enjoy!**
