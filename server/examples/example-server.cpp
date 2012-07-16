#include <objectifLune.hpp>
#include <iostream>

using namespace objectifLune;

int main(int argc, char *argv[])
{
	std::cout << "starting example server" << std::endl;
	
	Server* server = new Server();
	server->startService();
	
	int delay = 500;
	while(true)
	{
		server->scalar("frame time", 20.0f + (rand() & 100) / 20);
		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
		
		server->scalar("long time field", 2000.0f + (rand() & 1000) / 20);
		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
		
		server->scalar("textures loaded", (rand() & 9));
		server->scalar("lucky number", (rand() & 99));
		server->scalar("fraction of a whole", (float)(rand() & 99) /3.0f);
		
		server->info("Uh, everything's under control. Situation normal.");
		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
		
//		server->trace("1 this is a trace message");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
//		server->debug("2 This debug message is a tad longer than the other messages, because it is very important and hence needs the extra space to express its meaning, position in the universe, and everything else.");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
//		server->info("3 This service is kindly provided by the intergallactic time traveling agency");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
//		server->warn("4 Final Warning!");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
//		server->error("5 There is an error in this message");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
//		server->fatal("6 Fatal message is fatal");
//		boost::this_thread::sleep(boost::posix_time::milliseconds(delay));
	}
}
