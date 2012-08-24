#ifndef OBJECTIF_LUNE_SINGLETON
#define OBJECTIF_LUNE_SINGLETON

#include <objectif-lune/objectifLune.hpp>

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
		static Server* Get();
	};
}

#endif
