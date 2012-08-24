#ifndef OBJECTIF_LUNE_SINGLETON
#define OBJECTIF_LUNE_SINGLETON

#include <objectif-lune/Server.hpp>

namespace objectifLune
{
	/**
	 * Simple singleton accessor to an objectif lune object.
	 */
	class Singleton
	{
	private:
		static Server* instance;
		Singleton() {}
		Singleton(const Singleton&) {}
		~Singleton() {}
	public:
		static Server& Get();
	};
	
	Server* Singleton::instance = 0;
	
	Server& Singleton::Get()
	{
		if (!instance)
		{
			instance = new Server();
			instance->startService();
		}
		return *instance;
	}
}

#endif
