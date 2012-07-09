#include <objectifLune.hpp>
#include <iostream>

int main(int argc, char *argv[])
{
	std::cout << "starting example server" << std::endl;
	
	objectifLune::Server* server = new objectifLune::Server();
	server->hello();
	
	std::getchar();
}