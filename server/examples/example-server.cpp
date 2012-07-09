#include <objectifLune.hpp>
#include <iostream>

using websocketpp::server;

int main(int argc, char *argv[])
{
	std::cout << "starting example server" << std::endl;

	unsigned short port = 60600;
	
	try
	{
		server::handler::ptr handle(new objectifLune::Server());
		server endpoint(handle);
		
		std::cout << "Starting WebSocket echo server on port " << port << std::endl;
        endpoint.listen(port);
	}
	catch (std::exception &e)
	{
		std::cerr << "Exception: " << e.what() << std::endl;
	}
}