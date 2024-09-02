#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"
#include <stdint.h>

// #define TREE_SITTER_DEBUG

#ifdef TREE_SITTER_DEBUG
#include <assert.h>
#include <stdio.h>
#endif

// The different tokens the external scanner support
// See `externals` in `grammar.js` for a description of most of them.
enum TokenType {
  IGNORED,

  EMPTY_LINE,

  SOFTBREAK,

  INDENT_AT_HERE,
  DEDENT,

  INLINE_VERBATIM_START,
  INLINE_VERBATIM_END,
  INLINE_VERBATIM_CHAR,
};

// --- start of helper macros

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

// --- end of helper macros

// --- start of some declarations
typedef uint16_t Indent;
typedef uint16_t Count;
typedef Array(Indent) Indents;
typedef struct State {
  Indents indents;
  Count inline_verbatim_count;
} State;
static Indent current_indent(Indents const *indents);
// --- end of some declarations

bool tree_sitter_sdoc_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  // we have to devide the scan function into several branched
  // if we have seq(block1, block2), then block1 should succeed if it consumes something.

  State *s = payload;

  // deal with leading spaces
  // consume nothing if fails
  if (valid_symbols[INDENT_AT_HERE]) {
    if (lexer->get_column(lexer) > current_indent(&(s->indents))) {
      array_push(&(s->indents), lexer->get_column(lexer));
      lexer->result_symbol = INDENT_AT_HERE;
      return true;
    }
  } else if (lexer->get_column(lexer) == 0) {
    lexer->mark_end(lexer);
    while (lexer->lookahead == ' ') {
      lexer->advance(lexer, false);
    }
    // first we detect EMPTY_LINE
    if (lexer->lookahead == '\n') {
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);
      assert(valid_symbols[EMPTY_LINE]);
      lexer->result_symbol = EMPTY_LINE;
      return true;
    }
    // then we detect DEDENT
    Indent const ci = current_indent(&(s->indents));
    if (lexer->get_column(lexer) < ci) {
      if (valid_symbols[DEDENT]) {
        array_pop(&(s->indents));
        lexer->result_symbol = DEDENT;
        return true;
      }
    }
    // ignore leading spaces
    if (valid_symbols[IGNORED] && lexer->get_column(lexer) > 0) {
      lexer->result_symbol = IGNORED;
      lexer->mark_end(lexer);
      return true;
    }
  }

  if (s->inline_verbatim_count > 0) {
    assert(valid_symbols[INLINE_VERBATIM_CHAR]);
    assert(valid_symbols[INLINE_VERBATIM_END]);
    if (lexer->lookahead == '}') {
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);
      Count count = 0;
      while (lexer->lookahead == '`') {
        lexer->advance(lexer, false);
        ++count;
      }

      if (s->inline_verbatim_count == count) {
        lexer->result_symbol = INLINE_VERBATIM_END;
        s->inline_verbatim_count = 0;
        lexer->mark_end(lexer);
      } else {
        lexer->result_symbol = INLINE_VERBATIM_CHAR;
      }
      return true;
    } else {
      lexer->result_symbol = INLINE_VERBATIM_CHAR;
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);
      return true;
    }
  } else if (lexer->lookahead == '\n') {
    lexer->advance(lexer, false);
    lexer->mark_end(lexer);
    if (lexer->eof(lexer)) {
      return false;
    }
    // we can say next line is not
    while (lexer->lookahead == ' ') {
      lexer->advance(lexer, true);
    }
    if (lexer->lookahead != '\n' &&
        lexer->get_column(lexer) >= current_indent(&(s->indents))) {
      lexer->result_symbol = SOFTBREAK;
      return true;
    }
  } else if (lexer->lookahead == '`') {
    Count count = 0;
    while (lexer->lookahead == '`') {
      lexer->advance(lexer, false);
      ++count;
    }
    if (count > 0 && lexer->lookahead == '{') {
      if (valid_symbols[INLINE_VERBATIM_START]) {
        lexer->mark_end(lexer);
        lexer->advance(lexer, false);
        s->inline_verbatim_count = count;
        lexer->result_symbol = INLINE_VERBATIM_START;
        return true;
      }
    }
  }

  return false;
}

unsigned tree_sitter_sdoc_external_scanner_serialize(void *payload,
                                                     char *buffer) {
  State *s = payload;
  uint32_t size = 0;
  SAVE_ARRAY(buffer, size, (&(s->indents)));
  SAVE_TO_BUFFER(buffer, size, s->inline_verbatim_count);
#ifdef TREE_SITTER_DEBUG
  printf("scanner serialized\n");
#endif
  return size;
}

void tree_sitter_sdoc_external_scanner_deserialize(void *payload,
                                                   const char *buffer,
                                                   unsigned length) {
  State *s = payload;
  array_init(&(s->indents));
  s->inline_verbatim_count = 0;
  if (length > 0) {
    uint32_t size = 0;
    LOAD_ARRAY(buffer, size, (&(s->indents)));
    LOAD_FROM_BUFFER(buffer, size, s->inline_verbatim_count);
    assert(size == length);
  }
#ifdef TREE_SITTER_DEBUG
  printf("scanner deserialized\n");
#endif
}

void *tree_sitter_sdoc_external_scanner_create(void) {
  State *s = ts_malloc(sizeof(State));
#ifdef TREE_SITTER_DEBUG
  printf("scanner created\n");
#endif
  tree_sitter_sdoc_external_scanner_deserialize(s, NULL, 0);
  return s;
}

void tree_sitter_sdoc_external_scanner_destroy(void *payload) {
#ifdef TREE_SITTER_DEBUG
  printf("scanner destroyed\n");
#endif
  State *s = payload;
  array_delete(&(s->indents));
  ts_free(s);
}

static Indent current_indent(Indents const *indents) {
  if (indents->size == 0) {
    return 0;
  } else {
    return *array_back(indents);
  }
}
