# SDOC Syntax Design

This document outlines the syntax for SDOC, an S-expression based markup language designed for note-taking.

## Design Philosophy: Syntax vs. Semantics

SDOC is designed with a strict separation between its syntax and its semantics.

1.  **Syntax Layer (The Parser):** The core Tree-sitter grammar is intentionally simple. Its only job is to recognize two fundamental constructs: S-expressions (`{...}`) and raw text (Literals). The parser does not know the *meaning* of an S-expression; it only knows how to identify its boundaries and its tag.

2.  **Semantic Layer (The Application):** The application or tool that consumes the parse tree is responsible for interpreting the structure. It applies meaning to the S-expressions based on their tags and their position in the document. This layer distinguishes between block elements, inline elements, and attributes.

This separation makes the core parser extremely robust and context-free, while allowing for rich and complex semantics to be built on top.

## Core Syntax

The grammar recognizes only two types of nodes:

-   **S-expression:** An expression enclosed in matching curly braces, starting with a tag. Example: `{p Hello, world!}`
-   **Literal:** Any raw text outside of an S-expression.

### S-expression

-   **Structure:** An S-expression consists of an opening fence, a tag, content, and a closing fence.
-   **Fences:** To handle nesting, the number of opening braces (`{`) must exactly match the number of closing braces (`}`).
-   **Tag:** The first element after the opening fence is the `tag`, which is an identifier for the expression.
-   **Content:** Anything between the tag and the closing fence is the content. The content can be a mix of literals and other S-expressions.

## Semantic Interpretation

The meaning of an S-expression is determined by the application, based on its tag and context.

### Block vs. Inline Elements

-   **Block:** An S-expression at the top level of the document, or nested directly inside another block, is typically interpreted as a block-level element (e.g., a paragraph, a list, a quote).
-   **Inline:** An S-expression that appears within a line of text is interpreted as an inline element (e.g., for bolding, italics, or links).
-   **Implicit Paragraphs:** For readability, raw text literals at the top level of the document are treated as paragraphs without needing a `{p ...}` wrapper.

### Attributes

Attributes are defined using S-expressions. An application can designate certain tags (e.g., `id`, `class`, `lang`) to be interpreted as attributes for their parent S-expression.

**Example:**

Consider the following SDOC text:

```sdoc
{div {class "container"} 
  {p {id "intro"} This is the first paragraph.}
}
```

**Syntactic Parse Tree (Simplified):**

```
(s_expression (tag: div)
  (s_expression (tag: class) (literal: "container"))
  (s_expression (tag: p)
    (s_expression (tag: id) (literal: "intro"))
    (literal: "This is the first paragraph.")
  )
)
```

**Semantic Interpretation:**

-   The application sees the outer `{div ...}` S-expression.
-   It then sees the inner `{class "container"}` expression. Recognizing the `class` tag as a special attribute tag, it assigns the class "container" to the `div` element.
-   It then sees the `{p ...}` expression and interprets it as a nested block (a paragraph).
-   Inside the paragraph, it finds an `{id "intro"}` expression, which it interprets as an attribute for the paragraph.

This two-layer design provides a powerful combination of a simple, robust parser and the flexibility to build rich document semantics. 
