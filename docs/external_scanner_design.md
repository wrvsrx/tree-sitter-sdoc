# External Scanner Algorithm Design for sdoc

### Core Data Structures

To correctly handle the state, our scanner needs to maintain two core data structures:

1.  **`delimiter_stack`**: A Last-In, First-Out (LIFO) stack to track all currently open delimiters (like `{` or `{{`). Each element on the stack will contain:
    *   `type`: An enum with values `STANDARD` or `VERBATIM`.
    *   `brace_count`: The number of opening braces, used to correctly match the closing braces of a `verbatim` block (e.g., `{{` must be closed by `}}`).

2.  **`pending_tokens`**: A First-In, First-Out (FIFO) queue to store tokens waiting to be emitted. Tree-sitter's `scan` function can only return one token at a time. However, in some situations (like an implicit paragraph ending just before an s-expression begins), we need to emit multiple tokens sequentially (e.g., `IMPLICIT_PARAGRAPH_END` and `STANDARD_S_EXPRESSION_START`). This queue solves that problem.
