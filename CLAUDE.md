# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Tree-sitter grammar for **SDOC**, an S-expression based markup language designed for note-taking. The language combines the structured nature of S-expressions with the readability of plain text.

## Language Syntax

SDOC supports two main content types:

1. **Plain text paragraphs** - No markup required, written as regular text
2. **S-expression blocks** - Structured content using `{tag_name content}` syntax

Example SDOC syntax:
```
这是一个普通段落。

{title "标题示例"}

{list
  {item "第一项"}
  {item "第二项包含 {bold "粗体"} 文本"}
}

{quote
  这是引用的内容。
  {author "作者名"}
}
```

## Development Commands

### Core Tree-sitter Commands
- `tree-sitter generate` - Generate parser from grammar.js
- `tree-sitter test` - Run all test cases in test/corpus/
- `tree-sitter test -d` - Run tests with debug output
- `tree-sitter parse <file>` - Parse a specific .sdoc file

### Build System (Nix)
- `nix develop` - Enter development shell with tree-sitter tools
- `nix build` - Build the grammar package
- `nix build .#vimplugin-treesitter-grammar-sdoc` - Build Neovim plugin

## Architecture

### Grammar Structure (grammar.js)
The grammar defines a context-free language with these key components:

- **document**: Root node containing elements
- **block_element**: S-expression blocks `{tag_name content}`
- **paragraph**: Plain text lines (no braces required)
- **string_literal**: Quoted strings with escape sequence support
- **text_content**: Unquoted text within blocks
- **tag_name**: Alphanumeric identifiers for block types

### Key Design Decisions
- **Precedence handling**: Paragraphs have lower precedence (-1) to avoid conflicts with block elements
- **Whitespace handling**: Only spaces and tabs are treated as extras, newlines are significant
- **Escape sequences**: Full support for `\` escaping within string literals
- **Mixed content**: Blocks can contain nested blocks, strings, and raw text

### Test Suite Structure
- `test/corpus/syntax.txt` - Main test file with tree-sitter corpus format
- `test/examples/` - Individual .sdoc example files
- Tests cover: plain text, nested blocks, mixed content, escaped characters, and edge cases

### Syntax Highlighting (queries/highlights.scm)
- Semantic highlighting based on tag names (e.g., `title` → heading, `bold` → strong)
- Syntax highlighting for brackets, quotes, and escape sequences
- Pattern matching for common semantic tags

## Grammar Modification Guidelines

When modifying the grammar:

1. **Always regenerate** with `tree-sitter generate` after changes
2. **Update tests** in `test/corpus/syntax.txt` to match new parse trees
3. **Test thoroughly** - run `tree-sitter generate` and then `tree-sitter test` to ensure all cases pass
4. **Update highlights** in `queries/highlights.scm` for new node types

## Testing Guidelines

**WARNING: Do not use `tree-sitter test -u` indiscriminately.**

This command overwrites test cases with the parser's current (and possibly incorrect) output. Before you are confident that the grammar's behavior is correct, do not use it. Otherwise, the tests lose their value as a verification standard. The correct practice is to first manually write the expected parse tree, then run `tree-sitter test` to verify that the grammar produces that result.

- Use tree-sitter corpus format: test cases separated by `===============================================================================`
- Include both input text and expected parse tree structure
- Test edge cases: empty tags, nested structures, escaped characters
- Verify parse trees match exactly - extra/missing `(newline)` nodes will cause failures