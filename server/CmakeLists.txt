cmake_minimum_required(VERSION 2.8)
project(objectif-lune CXX)

set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)

find_package(Boost REQUIRED COMPONENTS System Date_Time Regex Thread)

add_subdirectory(external/websocketpp)
add_subdirectory(src)


option(OBJECTIF_LUNE_BUILD_EXAMPLES "Build the Objectif Lune examples" ON)
if (OBJECTIF_LUNE_BUILD_EXAMPLES)
    add_subdirectory(examples)
endif(OBJECTIF_LUNE_BUILD_EXAMPLES)