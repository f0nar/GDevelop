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

# Utility rule file for DestroyOutsideBehavior_clang-format.

# Include any custom commands dependencies for this target.
include Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/compiler_depend.make

# Include the progress variables for this target.
include Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/progress.make

Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DestroyOutsideBehavior && /opt/homebrew/opt/llvm/bin/clang-format -i -style="{BasedOnStyle: Google, BinPackParameters: false, BinPackArguments: false}" /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/DestroyOutsideBehavior/DestroyOutsideBehavior.cpp /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/DestroyOutsideBehavior/DestroyOutsideBehavior.h /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/DestroyOutsideBehavior/Extension.cpp /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/DestroyOutsideBehavior/JsExtension.cpp

DestroyOutsideBehavior_clang-format: Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format
DestroyOutsideBehavior_clang-format: Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/build.make
.PHONY : DestroyOutsideBehavior_clang-format

# Rule to build all files generated by this target.
Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/build: DestroyOutsideBehavior_clang-format
.PHONY : Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/build

Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/clean:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DestroyOutsideBehavior && $(CMAKE_COMMAND) -P CMakeFiles/DestroyOutsideBehavior_clang-format.dir/cmake_clean.cmake
.PHONY : Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/clean

Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/depend:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/vpohorielov/projects/f0nar/GDevelop /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/DestroyOutsideBehavior /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DestroyOutsideBehavior /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : Extensions/DestroyOutsideBehavior/CMakeFiles/DestroyOutsideBehavior_clang-format.dir/depend

