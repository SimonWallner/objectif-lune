#ifndef OBJECTIF_LUNE_HPP_
#define OBJECTIF_LUNE_HPP_

#include <string>
#include <map>

#include "MessageCallback.hpp"

namespace objectifLune
{
	class ServerHandler;
	
	class Server : public MessageCallback
	{
	public:
		Server(unsigned short portNumber = 60600);

		void startService();
		
		void waitForConnections(unsigned int timeout = 1000) const;
		
		// logging methods
		void trace(const std::string& msg) const;
		void debug(const std::string& msg) const;
		void info(const std::string& msg) const;
		void warn(const std::string& msg) const;
		void error(const std::string& msg) const;
		void fatal(const std::string& msg) const;
		
		// sending telemetry data
		void scalar(const std::string& name, float value) const;
		
		// sending time domain telemetry data
		void data(float reference, const std::string& name, float value) const;
		
		// register a float variable for tweaking
		void registerVariable(std::string name, float* pointer, float min, float max, std::string description);
		
//		void registerScreenshotHandler( some handler stuff...)
		
		// @Override
		void onMessage(std::string);
		
	private:
		ServerHandler* serverHandler;
		
		unsigned short portNumber;
		
		void sendLogMessage(const std::string& logLevel, const std::string& msg) const;
		
		void startupThread();
		
		typedef std::map<std::string, float*> FloatTweakingMap;
		
		FloatTweakingMap floatTweakingMap;
	};
}

#endif
