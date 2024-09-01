We want to develop a language like djot with a unified grammar at block level and inline level respectively.

# Block level

We end blocks by emptyline(`\n\n+`).

Characters at block start have speical meaning for block, even for space. So this language should be indent sensitive.

- asdf

- asdf

  - sadf

  - asdf
lkjl


# Inline level
