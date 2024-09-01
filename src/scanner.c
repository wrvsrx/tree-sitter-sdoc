#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"

// #define TREE_SITTER_DEBUG

#ifdef TREE_SITTER_DEBUG
#include <assert.h>
#include <stdio.h>
#endif

// The different tokens the external scanner support
// See `externals` in `grammar.js` for a description of most of them.
enum TokenType {
  EMPTY_LINE,
  SOFTBREAK,
};

#define FOR(index, upper_bound)                                                \
  for (__typeof__(upper_bound) index = 0; index < upper_bound; ++index)

#define SAVE_TO_BUFFER(buffer, size, value)                                    \
  *(__typeof__(value) *)(buffer + size) = value;                               \
  size += sizeof(__typeof__(value));

#define SAVE_ARRAY(buffer, size, array)                                        \
  SAVE_TO_BUFFER(buffer, size, array->size);                                   \
  FOR(i, array->size) { SAVE_TO_BUFFER(buffer, size, array->contents[i]) }

#define LOAD_FROM_BUFFER(buffer, size, value)                                  \
  value = *(__typeof__(value) *)(buffer + size);                               \
  size += sizeof(__typeof__(value));

#define LOAD_ARRAY(buffer, size, array)                                        \
  {                                                                            \
    uint32_t count = 0;                                                        \
    LOAD_FROM_BUFFER(buffer, size, count);                                     \
    array_grow_by(array, count);                                               \
    FOR(i, array->size) { LOAD_FROM_BUFFER(buffer, size, array->contents[i]) } \
  }

void *tree_sitter_sdoc_external_scanner_create(void) { return NULL; }

void tree_sitter_sdoc_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_sdoc_external_scanner_serialize(void *payload,
                                                     char *buffer) {
  return 0;
}

void tree_sitter_sdoc_external_scanner_deserialize(void *payload,
                                                   const char *buffer,
                                                   unsigned length) {}

bool tree_sitter_sdoc_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  if (lexer->get_column(lexer) == 0) {
    // first we detect EMPTY_LINE
    while (lexer->lookahead == ' ') {
      lexer->advance(lexer, false);
    }
    if (lexer->lookahead == '\n') {
      lexer->advance(lexer, false);
      assert(valid_symbols[EMPTY_LINE]);
      lexer->result_symbol = EMPTY_LINE;
      return true;
    }
  } else if (lexer->lookahead == '\n') {
    // then we detect softbreak
    lexer->advance(lexer, false);
    lexer->mark_end(lexer);
    if (lexer->eof(lexer)) {
      return false;
    }
    while (lexer->lookahead == ' ') {
      lexer->advance(lexer, true);
    }
    if (lexer->lookahead != '\n') {
      lexer->result_symbol = SOFTBREAK;
      return true;
    }
  }
  return false;
}
