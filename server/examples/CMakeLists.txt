include_directories(${PROJECT_SOURCE_DIR}/src)

add_executable(example-server
	example-server.hpp
	example-server.cpp)

target_link_libraries(example-server
	objectif-lune)