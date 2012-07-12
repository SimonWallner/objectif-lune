#include <objectifLune.hpp>
#include <iostream>

using namespace objectifLune;

int main(int argc, char *argv[])
{
	std::cout << "starting example server" << std::endl;
	
	Server* server = new Server();
	server->startService();
	
	while(true)
	{
		server->info("hello, logger");
		boost::this_thread::sleep(boost::posix_time::seconds(3));
	}
}
