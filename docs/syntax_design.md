# SDOC Syntax Design

This document outlines the syntax for SDOC, an S-expression based markup language designed for note-taking.

## Design Philosophy: Syntax vs. Semantics

SDOC is designed with a strict separation between its syntax and its semantics.

1.  **Syntax Layer (The Parser):** The core Tree-sitter grammar is intentionally simple. Its only job is to properly recognize the nested structure of S-expressions (`{...}`) and identify raw text outside of them (Implicit Paragraphs). The parser does not know the *meaning* of an S-expression.

2.  **Semantic Layer (The Application):** The application that consumes the parse tree is responsible for interpreting the structure. It applies meaning to S-expressions based on their tags and their position in the document. This layer distinguishes between block elements, inline elements, and attributes.

This separation makes the core parser extremely robust while allowing for rich semantics.

## Core Syntax

The grammar recognizes three main syntactic structures:

### 1. Standard S-expression (`{...}`)

A block opened with a **single brace** is a standard S-expression. Its content is parsed for nested S-expressions and text literals.

```sdoc
{list 
  {item One}
  {item Two}
}
```

### 2. Verbatim S-expression (`{{...}}`, `{{{...}}}`)

A block opened with **two or more braces** is a verbatim S-expression. Its content is captured as a **single, unparsed literal string**. A verbatim block does not have a tag.

This is the primary mechanism for including content that contains special characters or should not be parsed, such as code snippets.

```sdoc
{code {{(defun factorial (n)
    (if (zerop n) 1 
      (* n (factorial (- n 1))))}}}
```

### 3. Implicit Paragraph

- An `implicit_paragraph` is a sequence of one or more consecutive lines of text that does not start with an opening brace (`{`).
- The sequence is terminated by the first occurrence of two or more consecutive newlines (i.e., a blank line).

This allows for natural, readable text without explicit markup.

## Semantic Interpretation

The meaning of an S-expression is determined by the application, based on its tag and context.

### Implicit Paragraphs

Semantically, an application should treat an `implicit_paragraph` node as a standard paragraph, as if it were written `{p ...}`.

### Attributes

Attributes are defined using standard S-expressions. An application can designate certain tags (e.g., `id`, `class`, `lang`) to be interpreted as attributes for their parent S-expression. The content of an attribute S-expression is a literal.

**Example:**

Consider the following SDOC text:

```sdoc
{div {class container} 
  {p {id intro} This is the first paragraph.}
}
```

**Syntactic Parse Tree (Simplified):**

```
(s_expression (tag: div)
  (s_expression (tag: class) (literal: container))
  (s_expression (tag: p)
    (s_expression (tag: id) (literal: intro))
    (literal: "This is the first paragraph.")
  )
)
```

**Semantic Interpretation:**

-   The application sees the outer `{div ...}` S-expression.
-   It then sees the inner `{class container}` expression. Recognizing `class` as an attribute tag, it assigns the value `container` to the `div` element.
-   It proceeds to parse the `{p ...}` expression as a nested paragraph, applying the same logic for its `id` attribute.

This two-layer design provides a powerful combination of a simple, robust parser and the flexibility to build rich document semantics.
