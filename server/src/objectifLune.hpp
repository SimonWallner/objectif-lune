#ifndef OBJECTIF_LUNE_HPP_
#define OBJECTIF_LUNE_HPP_

#include <string>

#include "serverHandler.hpp"

namespace objectifLune
{
	class Server
	{
	public:
		Server(unsigned short portNumber = 60600);

		void startService();
		
		void waitForConnections(unsigned int timeout = 1000) const;
		
		// logging methods
		void trace(std::string msg) const;
		void debug(std::string msg) const;
		void info(std::string msg) const;
		void warn(std::string msg) const;
		void error(std::string msg) const;
		void fatal(std::string msg) const;
		
		// sending telemetry data
		void scalar(std::string name, float value) const;
		
		// sending time domain telemetry data
		void data(float reference, std::string name, float value) const;
		
		// register a float variable for tweaking
//		void registerVariable(std::string name, float* pointer, float min, float max, std::string description);
//		void registerVariable(std::string name, bool* pointer, std::string description);
	private:
		
		ServerHandler* serverHandler;
		
		unsigned short portNumber;
		
		void sendLogMessage(std::string logLevel, std::string msg) const;
		
		void startupThread();
	};
}

#endif
