# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.27

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CMake.app/Contents/bin/cmake

# The command to remove a file.
RM = /Applications/CMake.app/Contents/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/vpohorielov/projects/f0nar/GDevelop

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild

# Utility rule file for AnchorBehavior_clang-format.

# Include any custom commands dependencies for this target.
include Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/compiler_depend.make

# Include the progress variables for this target.
include Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/progress.make

Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/AnchorBehavior && /opt/homebrew/opt/llvm/bin/clang-format -i -style="{BasedOnStyle: Google, BinPackParameters: false, BinPackArguments: false}" /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/AnchorBehavior/AnchorBehavior.cpp /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/AnchorBehavior/AnchorBehavior.h /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/AnchorBehavior/Extension.cpp /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/AnchorBehavior/JsExtension.cpp

AnchorBehavior_clang-format: Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format
AnchorBehavior_clang-format: Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/build.make
.PHONY : AnchorBehavior_clang-format

# Rule to build all files generated by this target.
Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/build: AnchorBehavior_clang-format
.PHONY : Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/build

Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/clean:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/AnchorBehavior && $(CMAKE_COMMAND) -P CMakeFiles/AnchorBehavior_clang-format.dir/cmake_clean.cmake
.PHONY : Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/clean

Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/depend:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/vpohorielov/projects/f0nar/GDevelop /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/AnchorBehavior /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/AnchorBehavior /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : Extensions/AnchorBehavior/CMakeFiles/AnchorBehavior_clang-format.dir/depend

