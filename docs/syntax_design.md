# SDOC Syntax Design

This document outlines the syntax for SDOC, an S-expression based markup language designed for note-taking.

## Core Concepts

SDOC is built on two primary content types:

1.  **Implicit Paragraphs:** Plain text that does not require any special markup.
2.  **Blocks:** Structured content enclosed in curly braces, forming a syntax similar to S-expressions.

## Block Syntax

Blocks are the fundamental structural element in SDOC.

### General Form

A block consists of an opening fence, a tag name, content, and a closing fence.

```
{tag_name content}
```

### Fenced Blocks

To handle nested structures and verbatim content unambiguously, SDOC uses a "fenced block" mechanism. The number of opening curly braces must exactly match the number of closing curly braces.

-   A block opened with `{` must be closed with `}`.
-   A block opened with `{{` must be closed with `}}`.
-   A block opened with `{{{` must be closed with `}}}`.
-   And so on.

This design allows for robust nesting without the need for escape characters for braces within content.

**Example:**

```sdoc
{{note
  This is a note.
  {quote Source: `http://example.com`}
}}
```

### Tags

The `tag_name` is an identifier that immediately follows the opening brace fence. It defines the type of the block.

-   Tag names consist of alphanumeric characters, underscores (`_`), hashes (`#`), and asterisks (`*`).
-   No whitespace is allowed between the opening fence and the tag name.

## Content Model

The content within a block can be a mix of several types:

-   **Nested Blocks:** A block can contain other blocks.
-   **Text:** Plain text content.
-   **Verbatim Content:** Inline text that should be treated literally.
-   **Newlines:** Newlines are preserved within blocks.

### Implicit Paragraphs

Any text that is not part of a block is considered an implicit paragraph. Paragraphs are separated by one or more blank lines.

### Verbatim Inline Content

To include inline content that might contain special characters (such as `{` or `}`), backticks (`` ` ``) are used. The text within the backticks is treated as literal text.

**Example:**

```sdoc
{code The following is a JSON object: `{"key": "value"}`}
```
