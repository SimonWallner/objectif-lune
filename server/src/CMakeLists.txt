include_directories(${PROJECT_SOURCE_DIR}/src)

add_definitions(-pedantic -std=c++11)
add_definitions(-Wall -Wextra -Werror)
add_definitions(-Wno-c++11-extensions)
					
include_directories(
	${PROJECT_SOURCE_DIR}/include
	${PROJECT_SOURCE_DIR}/external/websocketpp/src
	${Boost_INCLUDE_DIR}
)

file(GLOB_RECURSE INCLUDE_HEADER_FILES ${PROJECT_SOURCE_DIR}/include/*.hpp)
file(GLOB_RECURSE HEADER_FILES *.hpp)
file(GLOB_RECURSE SOURCE_FILES *.cpp)

add_library(objectif-lune
	${SOURCE_FILES}
	${HEADER_FILES}
	${INCLUDE_HEADER_FILES}
)

target_link_libraries(objectif-lune
	websocketpp
)
