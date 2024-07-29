{ tree-sitter, generated-src }:
let
  inherit (tree-sitter) buildGrammar;
in
buildGrammar {
  language = "sdoc";
  version = "0.0.0";
  src = generated-src;
}
