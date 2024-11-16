# OneLoader-ISAT
High(?) performance mod loader for In Stars and Time

## Credits/Licensing
This project contains in part or in full the following projects:

- [node-stream-zip](https://github.com/antelle/node-stream-zip) | License: **MIT** | Degree of use: Library used in full to process mods bundled in zip files
- [JSON-Patch](https://github.com/Starcounter-Jack/JSON-Patch) | License: **MIT** | Degree of use: Library used in full to apply patches to game data
- [Rollup](https://github.com/rollup/rollup) | License: [Multiple](https://github.com/rollup/rollup/blob/master/LICENSE.md) | Degree of use: Building plugins shipped as ES modules

Additionally, I'd like to thank the developers of GOMORI for kick-starting the modding community and laying the necessary ground work for modloader development.

## Installation:
Please reference the [mods.one modding wiki](https://omori.wiki.mods.one/installing_oneloader) for instructions on how to install

## Making mods
Because this modloader aims to be a drop-in GOMORI replacement, you can follow mod making instructions from the [GOMORI repository](https://github.com/gilbert142/gomori). As more features are added to OneLoader that GOMORI doesn't implement, they will be implemented here.

## Usage
- **Logging:** OneLoader writes a text file into the game's main folder called `latest.log`. It contains a timestamped list of everything that has happened since the game started that has relevance to the debugging of OneLoader.
- **Command line parameters:** OneLoader allows you to specify command line options and itself accepts two:
  - `--no-mods`: Start the game in safe mode, skip loading and injection of any mods
  - `--dump-overlay`: Dumps all "built" files to a directory on disk for debugging purposes. Can be used to create modloader-less mods that simply replace game files
- **Conflict resolution:** When you add any mods that conflict with each other, please be prepared to use a mouse to select which mod to prefer during the conflict resolution step.

## Reporting issues
If you encounter any issue or bug, please open a github issue in this repository and attach the following:
- List of all mods you have installed (download links or files)
- A copy of the `latest.log` file from the game session where the bug/error occured

## Get in touch with the developer
~~You can reach me via Discord through DMs ( Rph#9999 is my tag ), via the [OMORI discord](https://discord.gg/omori) (Simply tag me in modding-discussion) or via the [mods.one discord](https://discord.gg/EDTMF85Hnp)~~
