#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"
#include <stdint.h>
#include <string.h>

// NOTE: This enum MUST be kept in sync with `externals` in grammar.js
enum TokenType {
  S_EXPRESSION_START,
  S_EXPRESSION_END,
  VERBATIM_S_EXPRESSION_START,
  VERBATIM_S_EXPRESSION_END,
  VERBATIM_CONTENT,
  IMPLICIT_PARAGRAPH_START,
  IMPLICIT_PARAGRAPH_END,
};

typedef enum {
  STANDARD,
  VERBATIM,
} DelimiterType;

typedef struct {
  DelimiterType type;
  uint8_t brace_count;
} Delimiter;

// The scanner state
typedef struct {
  Array(Delimiter) delimiters;
} Scanner;

// --- Required Tree-sitter Functions ---

void *tree_sitter_sdoc_external_scanner_create() {
  Scanner *scanner = (Scanner *)ts_calloc(1, sizeof(Scanner));
  array_init(&scanner->delimiters);
  return scanner;
}

void tree_sitter_sdoc_external_scanner_destroy(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  array_delete(&scanner->delimiters);
  ts_free(scanner);
}

void tree_sitter_sdoc_external_scanner_reset(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  array_clear(&scanner->delimiters);
}

unsigned tree_sitter_sdoc_external_scanner_serialize(void *payload,
                                                     char *buffer) {
  Scanner *scanner = (Scanner *)payload;
  unsigned size = 0;

  // Serialize delimiters
  unsigned delimiter_count = scanner->delimiters.size;
  memcpy(&buffer[size], &delimiter_count, sizeof(delimiter_count));
  size += sizeof(delimiter_count);

  size_t delimiters_data_size = delimiter_count * sizeof(Delimiter);
  if (size + delimiters_data_size > TREE_SITTER_SERIALIZATION_BUFFER_SIZE) {
    return 0; // Avoid buffer overflow
  }
  memcpy(&buffer[size], scanner->delimiters.contents, delimiters_data_size);
  size += delimiters_data_size;

  return size;
}

void tree_sitter_sdoc_external_scanner_deserialize(void *payload,
                                                   const char *buffer,
                                                   unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  tree_sitter_sdoc_external_scanner_reset(scanner);
  if (length == 0) {
    return;
  }

  unsigned size = 0;

  // Deserialize delimiters
  unsigned delimiter_count;
  if (size + sizeof(delimiter_count) > length)
    return;
  memcpy(&delimiter_count, &buffer[size], sizeof(delimiter_count));
  size += sizeof(delimiter_count);

  array_reserve(&scanner->delimiters, delimiter_count);
  size_t delimiters_data_size = delimiter_count * sizeof(Delimiter);
  if (size + delimiters_data_size > length)
    return;
  memcpy(scanner->delimiters.contents, &buffer[size], delimiters_data_size);
  scanner->delimiters.size = delimiter_count;
}

bool tree_sitter_sdoc_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  // Main scanning logic will be implemented here.
  return false;
}
