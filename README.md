# KMX Coder - VSCode Extension

KMX Coder is a VSCode extension that helps you optimize and analyze your code with ease. It leverages the power of ChatGPT, an advanced AI language model by OpenAI, to refactor your code and provide you with valuable insights and suggestions for improvement. With simple commands, you can transform your code and make it more efficient and maintainable. With custom prompt command it can write code for you or do whatever you want, be creative!

## Features

KMX Coder offers features powered by ChatGPT:

( Ctrl + Shift + P) Commands

1. `KMX Coder Optimize Selected` : Refactors your selected code using ChatGPT and provides a diff view to show the changes.
2. `KMX Coder Analyze Selected` : Leverages ChatGPT to offer code review and suggestions, presenting the results in a new untitled editor.
3. `KMX Coder Custom Command on Selected` : Query ChatGPT with anything you want, option to add beforeCode and afterCode prompt and select output format ( new untitled document of diff window ).
4. `KMX Coder Optimize File` : Similar to the 'Optimize' command but operates on an entire file. The optimized code is displayed as a diff against the original file
5. `KMX Coder Update Tests` : Updates unit tests based on changes in the service class. The updated tests are displayed as a diff against the original tests

## Requirements

VS Code ^1.77.0

## Extension Settings

This extension contributes the following settings:

1. `OpenAI API Key` : Your OpenAI API key, used for authenticating with the ChatGPT service.
2. `OpenAI Engine Model` : The OpenAI engine model you want to use with the extension.

## Known Issues

None

## Release Notes

1.0.0
Initial release of KMX Coder.

1.1.0
Added `KMX Coder: Optimize File` and `KMX Coder: Update Tests` commands

## Contribution

We welcome contributions. If you're interested in improving KMX Coder, please submit a pull request or open an issue on our GitHub Repository.

### 1.0.0

- KMX Coder Optimize Selected
- KMX Coder Analyze Selected
- KMX Coder Custom Command on Selected
- OpenAI apiKey Configuration
- OpenAI Engine Model Configuration
