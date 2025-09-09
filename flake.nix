{
  description = "tree-sitter-sdoc";

  inputs = {
    nixpkgs.url = "github:wrvsrx/nixpkgs/patched-nixos-unstable";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } (
      { inputs, ... }:
      {
        systems = [ "x86_64-linux" ];
        perSystem =
          { pkgs, ... }:
          let
            inherit (pkgs) callPackage;
          in
          rec {
            packages = callPackage ./. { };
            devShells.default = pkgs.mkShell {
              inputsFrom = [
                packages.tree-sitter-sdoc
                packages.generated-src
              ];
            };
            formatter = pkgs.nixfmt-rfc-style;
          };
      }
    );
}
