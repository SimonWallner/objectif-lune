#ifndef OBJECTIF_LUNE_HPP_
#define OBJECTIF_LUNE_HPP_

#include <iostream>

#include <websocketpp.hpp>

namespace objectifLune
{
	class ServerHandler : public websocketpp::server::handler
	{
	private:
		
	public: 
		
		void on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg);
		
		void on_open(websocketpp::server::connection_ptr con);
		
		void on_close(websocketpp::server::connection_ptr con);
	};
	
	class Server
	{
	public:
		Server(unsigned short portNumber = 60600);
		void startService();
		
	private:
		unsigned short portNumber;
	};
}

#endif
