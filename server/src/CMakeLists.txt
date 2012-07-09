include_directories(${PROJECT_SOURCE_DIR}/src)
					
link_directories(
	${PROJECT_SOURCE_DIR}/external/websocketpp/src
)

add_library(objectif-lune
	objectifLune.cpp
	objectifLune.hpp
)

target_link_libraries(websocketpp)