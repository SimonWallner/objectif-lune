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
		
		// logging methods
		void trace(std::string msg);
		void debug(std::string msg);
		void info(std::string msg);
		void warn(std::string msg);
		void error(std::string msg);
		void fatal(std::string msg);
		
		// sending telemetry data
		void scalar(std::string name, float value);
		
		// sending time domain telemetry data
		void data(float reference, std::string name, float value);
		
		// register a float variable for tweaking
//		void registerVariable(std::string name, float* pointer, float min, float max, std::string description);
//		void registerVariable(std::string name, bool* pointer, std::string description);
	private:
		
		ServerHandler* serverHandler;
		
		unsigned short portNumber;
		
		void sendLogMessage(std::string logLevel, std::string msg);
		
		void startupThread();
	};
}

#endif
