#include <objectifLune.hpp>
#include <iostream>

using namespace objectifLune;

int main(int argc, char *argv[])
{
	std::cout << "starting example server" << std::endl;
	
	Server* server = new Server();
	server->startService();
	
	bool cont = true;
	while(cont)
	{
		std::cout << "sending log message: ";
		std::string in;
		std::getline(std::cin, in);
		
		if (in == "q")
			cont = false;
		else 
			server->debug(in);
	}
}
