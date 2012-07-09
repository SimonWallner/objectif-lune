include_directories(${PROJECT_SOURCE_DIR}/src)
					
include_directories(
	${PROJECT_SOURCE_DIR}/external/websocketpp/src
	${Boost_INCLUDE_DIR}
)

add_library(objectif-lune
	objectifLune.cpp
	objectifLune.hpp
)

target_link_libraries(objectif-lune
	websocketpp
)