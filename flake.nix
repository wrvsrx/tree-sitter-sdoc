{
  description = "flake template";

  inputs = {
    flake-lock.url = "github:wrvsrx/flake-lock";
    nixpkgs.follows = "flake-lock/nixpkgs";
    flake-parts.follows = "flake-lock/flake-parts";
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
          {
            packages = rec {
              generated-src = callPackage ./generated-src.nix { };
              default = callPackage ./. { inherit generated-src; };
            };
            formatter = pkgs.nixfmt-rfc-style;
          };
      }
    );
}
