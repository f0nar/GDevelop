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
include Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/compiler_depend.make

# Include the progress variables for this target.
include Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/progress.make

# Include the compile flags for this target's objects.
include Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/flags.make

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/flags.make
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/includes_CXX.rsp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o: /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/Extension.cpp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o -MF CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o.d -o CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o -c /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/Extension.cpp

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/TiledSpriteObject.dir/Extension.cpp.i"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/Extension.cpp > CMakeFiles/TiledSpriteObject.dir/Extension.cpp.i

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/TiledSpriteObject.dir/Extension.cpp.s"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/Extension.cpp -o CMakeFiles/TiledSpriteObject.dir/Extension.cpp.s

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/flags.make
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/includes_CXX.rsp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o: /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/JsExtension.cpp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o -MF CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o.d -o CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o -c /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/JsExtension.cpp

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.i"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/JsExtension.cpp > CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.i

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.s"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/JsExtension.cpp -o CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.s

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/flags.make
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/includes_CXX.rsp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o: /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/TiledSpriteObject.cpp
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o -MF CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o.d -o CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o -c /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/TiledSpriteObject.cpp

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.i"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/TiledSpriteObject.cpp > CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.i

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.s"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && /Users/vpohorielov/projects/emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject/TiledSpriteObject.cpp -o CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.s

# Object files for target TiledSpriteObject
TiledSpriteObject_OBJECTS = \
"CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o" \
"CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o" \
"CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o"

# External object files for target TiledSpriteObject
TiledSpriteObject_EXTERNAL_OBJECTS =

/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/Extension.cpp.o
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/JsExtension.cpp.o
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/TiledSpriteObject.cpp.o
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/build.make
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/objects1.rsp
/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc: Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Linking CXX static library /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc"
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && $(CMAKE_COMMAND) -P CMakeFiles/TiledSpriteObject.dir/cmake_clean_target.cmake
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/TiledSpriteObject.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/build: /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/Output/Release_Emscripten/CppPlatform/Extensions/TiledSpriteObject.bc
.PHONY : Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/build

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/clean:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject && $(CMAKE_COMMAND) -P CMakeFiles/TiledSpriteObject.dir/cmake_clean.cmake
.PHONY : Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/clean

Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/depend:
	cd /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/vpohorielov/projects/f0nar/GDevelop /Users/vpohorielov/projects/f0nar/GDevelop/Extensions/TiledSpriteObject /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject /Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : Extensions/TiledSpriteObject/CMakeFiles/TiledSpriteObject.dir/depend

