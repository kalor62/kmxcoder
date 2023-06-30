# Change Log

All notable changes to the "kmxcoder" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0]

- Initial release

## [1.1.0]

### Added

*KMX Coder: Optimize File command: This new command optimizes an entire file. The optimized code is displayed as a diff against the original file, similar to the 'Optimize' command.
*KMX Coder: Update Tests command: This command updates unit tests based on changes in the service class. The updated tests are displayed as a diff against the original tests.
*Running command indicator: Now, a loading indicator will be displayed in the status bar at the bottom when a command is running, providing a better user experience.

### Fixed

Fixed issue where the command message disappeared prematurely. The new loading indicator will stay until the command execution is completed.

## [1.1.1]
### Fixed
- fixed diff on update-tests command

## [1.1.2]

### Fixed
- fixed diff between files to have original on the left and changed on the right, currently there is no way to have the vscode arrows poiting to the left to move new code into the original file, but having reversed order makes it even more confusing