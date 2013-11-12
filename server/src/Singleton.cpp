#include <objectif-lune/Singleton.hpp>

using namespace objectifLune;

Server* Singleton::instance = 0;

Server* Singleton::Get()
{
	if (!instance)
	{
		instance = new Server();
		instance->startService();
	}
	return instance;
}

