include_directories(${PROJECT_SOURCE_DIR}/src)
					
link_directories(
	${PROJECT_SOURCE_DIR}/external/websocketpp/src
)

add_library(objectif-lune
	objectif-lune.cpp
	objectif-lune.hpp
)

target_link_libraries(websocketpp)