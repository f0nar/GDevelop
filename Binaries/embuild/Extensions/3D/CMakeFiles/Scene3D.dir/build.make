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

# Include any dependencies generated for this target.
include Extensions/3D/CMakeFiles/Scene3D.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include Extensions/3D/CMakeFiles/Scene3D.dir/compiler_depend.make

# Include the progress variables for this target.
include Extensions/3D/CMakeFiles/Scene3D.dir/progress.make

# Include the compile flags for this target's objects.
include Extensions/3D/CMakeFiles/Scene3D.dir/flags.make

Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o: Extensions/3D/CMakeFiles/Scene3D.dir/flags.make
Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o: Extensions/3D/CMakeFiles/Scene3D.dir/includes_CXX.rsp
Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o: /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/3D/Model3DObjectConfiguration.cpp
Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o: Extensions/3D/CMakeFiles/Scene3D.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o -MF CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o.d -o CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o -c /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/3D/Model3DObjectConfiguration.cpp

Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.i"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/3D/Model3DObjectConfiguration.cpp > CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.i

Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.s"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/3D/Model3DObjectConfiguration.cpp -o CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.s

# Object files for target Scene3D
Scene3D_OBJECTS = \
"CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o"

# External object files for target Scene3D
Scene3D_EXTERNAL_OBJECTS =

/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc: Extensions/3D/CMakeFiles/Scene3D.dir/Model3DObjectConfiguration.cpp.o
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc: Extensions/3D/CMakeFiles/Scene3D.dir/build.make
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc: Extensions/3D/CMakeFiles/Scene3D.dir/objects1.rsp
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc: Extensions/3D/CMakeFiles/Scene3D.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX static library /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && $(CMAKE_COMMAND) -P CMakeFiles/Scene3D.dir/cmake_clean_target.cmake
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/Scene3D.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
Extensions/3D/CMakeFiles/Scene3D.dir/build: /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/Scene3D.bc
.PHONY : Extensions/3D/CMakeFiles/Scene3D.dir/build

Extensions/3D/CMakeFiles/Scene3D.dir/clean:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D && $(CMAKE_COMMAND) -P CMakeFiles/Scene3D.dir/cmake_clean.cmake
.PHONY : Extensions/3D/CMakeFiles/Scene3D.dir/clean

Extensions/3D/CMakeFiles/Scene3D.dir/depend:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/vpohorielov/projects/f0nar/GDevelop /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/3D /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D/CMakeFiles/Scene3D.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : Extensions/3D/CMakeFiles/Scene3D.dir/depend

