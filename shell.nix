# This sets up node.js and Yarn.
#
# To use, either:
#   * install Nix and enter a shell by typing `nix-shell`, or
#   * install Nix and direnv, and type `direnv allow`

{ pkgs ? import <nixpkgs> {} }:
with pkgs;
let
  nodejs-corepack = stdenv.mkDerivation {
    name = "nodejs-corepack";
    buildInputs = [
      nodejs
    ];
    phases = "installPhase";
    installPhase = ''
      mkdir -p $out/bin
      corepack enable --install-directory $out/bin
    '';
  };
in
mkShell {
  name = "v3-docs";

  buildInputs = [
    nodejs
    nodejs-corepack
  ];
}
