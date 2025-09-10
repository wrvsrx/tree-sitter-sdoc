#include "tree_sitter/parser.h"
#include <wctype.h>
#include <string.h>
#include <assert.h>

// A stack to keep track of the opening fence lengths for nested blocks.
#define MAX_NESTING_LEVEL 100
static uint8_t fence_length_stack[MAX_NESTING_LEVEL];
static uint8_t nesting_level = 0;

// Enum for the types of tokens this scanner will produce.
enum TokenType {
  BLOCK_START,
  BLOCK_END,
};

static bool push_fence_length(uint8_t length) {
    if (nesting_level >= MAX_NESTING_LEVEL) {
        return false; // Stack overflow
    }
    fence_length_stack[nesting_level++] = length;
    return true;
}

static bool pop_fence_length() {
    if (nesting_level == 0) {
        return false; // Stack underflow
    }
    nesting_level--;
    return true;
}

void *tree_sitter_sdoc_external_scanner_create() {
  return NULL;
}

void tree_sitter_sdoc_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_sdoc_external_scanner_serialize(
  void *payload,
  char *buffer
) {
    unsigned i = 0;
    buffer[i++] = nesting_level;
    if (nesting_level > 0) {
        memcpy(&buffer[i], fence_length_stack, nesting_level);
    }
    return i + nesting_level;
}

void tree_sitter_sdoc_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned length
) {
    if (length > 0) {
        nesting_level = buffer[0];
        assert(length > nesting_level);
        memcpy(fence_length_stack, &buffer[1], nesting_level);
    } else {
        nesting_level = 0;
    }
}

bool tree_sitter_sdoc_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {

    // Check for block end: requires a `}` at the current position.
    if (valid_symbols[BLOCK_END] && lexer->lookahead == '}' && nesting_level > 0) {
        uint8_t expected_length = fence_length_stack[nesting_level - 1];
        uint8_t observed_length = 0;
        while (lexer->lookahead == '}') {
            observed_length++;
            lexer->advance(lexer, false);
        }
        if (observed_length == expected_length) {
            pop_fence_length();
            lexer->result_symbol = BLOCK_END;
            return true;
        }
        // If lengths don't match, it's not a valid block end. Let the main parser handle it.
        return false;
    }

    // Check for block start: requires a `{` at the current position.
    if (valid_symbols[BLOCK_START] && lexer->lookahead == '{') {
        uint8_t fence_length = 0;
        while(lexer->lookahead == '{') {
            fence_length++;
            lexer->advance(lexer, false);
        }

        // A block start must be followed by a non-brace, non-whitespace character (the tag).
        if (iswspace(lexer->lookahead) || lexer->lookahead == '{' || lexer->lookahead == '}' || lexer->lookahead == '\0') {
            return false;
        }

        if (push_fence_length(fence_length)) {
            lexer->result_symbol = BLOCK_START;
            return true;
        }
    }

    return false;
}
