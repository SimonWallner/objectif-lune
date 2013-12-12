include_directories(${PROJECT_SOURCE_DIR}/src)

include_directories(
	${PROJECT_SOURCE_DIR}/include
	${PROJECT_SOURCE_DIR}/external/websocketpp/src
	${Boost_INCLUDE_DIR}
)

add_executable(example-server
	example-server.hpp
	example-server.cpp)

target_link_libraries(example-server
	objectif-lune
	${Boost_SYSTEM_LIBRARY}
	${Boost_REGEX_LIBRARY}
	${Boost_THREAD_LIBRARY}
	${Boost_DATE_TIME_LIBRARY}
)