# External Scanner Algorithm Design for sdoc

### Core Data Structure

To correctly handle the state of nested S-expressions, the external scanner maintains a single core data structure:

1.  **`delimiter_stack`**: A Last-In, First-Out (LIFO) stack, implemented as a Tree-sitter `Array`, to track all currently open delimiters (like `{` or `{{`). Each element on the stack is a `Delimiter` struct containing:
    *   `type`: An enum with values `STANDARD` or `VERBATIM`.
    *   `brace_count`: The number of opening braces, used to correctly match the closing braces of a `verbatim` block (e.g., `{{` must be closed by `}}`).

This stack allows the scanner to know the current nesting level and context, which is essential for correctly identifying `verbatim_content` and matching closing braces.
