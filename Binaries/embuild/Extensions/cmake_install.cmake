# Install script for directory: /Users/vpohorielov/projects/f0nar/GDevelop/Extensions

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/opt/homebrew/opt/llvm/bin/llvm-objdump")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/3D/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/AnchorBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DestroyOutsideBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/DraggableBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/Inventory/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/LinkedObjects/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/PanelSpriteObject/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/ParticleSystem/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/PathfindingBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/PhysicsBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/PlatformBehavior/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/PrimitiveDrawing/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/Shopify/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/SystemInfo/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TextEntryObject/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TextObject/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TiledSpriteObject/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/Spine/cmake_install.cmake")
  include("/Users/vpohorielov/projects/f0nar/GDevelop/Binaries/embuild/Extensions/TopDownMovementBehavior/cmake_install.cmake")

endif()

