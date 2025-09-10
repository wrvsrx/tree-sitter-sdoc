#include "tree_sitter/parser.h"
#include <wctype.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

enum TokenType {
  BLOCK_CONTENT,
};

void *tree_sitter_sdoc_external_scanner_create() {
  return NULL;
}

void tree_sitter_sdoc_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_sdoc_external_scanner_serialize(
  void *payload,
  char *buffer
) {
    return 0;
}

void tree_sitter_sdoc_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned length
) {}


bool tree_sitter_sdoc_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
    if (valid_symbols[BLOCK_CONTENT]) {
        // Skip leading whitespace.
        while (iswspace(lexer->lookahead)) {
            lexer->advance(lexer, true);
        }

        if (lexer->lookahead != '{') return false;

        int open_braces = 0;
        do {
            if (lexer->lookahead == '{') {
                open_braces++;
            } else if (lexer->lookahead == '}') {
                open_braces--;
            } else if (lexer->lookahead == '\0') { // End of file
                return false;
            }
            lexer->advance(lexer, false);
        } while (open_braces > 0);

        lexer->result_symbol = BLOCK_CONTENT;
        return true;
    }

    return false;
}
