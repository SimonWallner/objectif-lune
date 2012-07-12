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
		server->trace("1 this is a trace message");
		server->debug("2 This debug message is a tad longer than the other messages, because it is very important and hence needs the extra space to express its meaning, position in the universe, and everything else.");
		server->info("3 This service is kindly provided by the intergallactic time traveling agency");
		server->warn("4 Final Warning!");
		server->error("5 There is an error in this message");
		server->fatal("6 Fatal message is fatal");
		
		boost::this_thread::sleep(boost::posix_time::seconds(3));
	}
}
