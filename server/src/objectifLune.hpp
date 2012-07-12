#ifndef OBJECTIF_LUNE_HPP_
#define OBJECTIF_LUNE_HPP_

#include <iostream>
#include <string>
#include <set>

#include <websocketpp.hpp>

namespace objectifLune
{
	class ServerHandler : public websocketpp::server::handler
	{
	public: 
		
		void on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg);
		
		void on_open(websocketpp::server::connection_ptr con);
		
		void on_close(websocketpp::server::connection_ptr con);
		
		void broadcast(std::string msg);
		
	private:
		typedef std::set<connection_ptr> connection_set;
		
		connection_set connections;
		boost::mutex mutex;    // guards m_connections
	};
	
	class Server
	{
	public:
		Server(unsigned short portNumber = 60600);
		void startService();
		
		void startupThread();
		
		void trace(std::string msg);
		void debug(std::string msg);
		void info(std::string msg);
		void warn(std::string msg);
		void error(std::string msg);
		void fatal(std::string msg);
		
		void sendLogMessage(std::string logLevel, std::string msg);
		
	private:
		
		ServerHandler* serverHandler;
		
		unsigned short portNumber;
		

		
		void broadcast(std::string datum);
	};
}

#endif
