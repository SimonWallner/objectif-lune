#ifndef SERVER_HANDLER_HPP_
#define SERVER_HANDLER_HPP_

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
}

#endif
