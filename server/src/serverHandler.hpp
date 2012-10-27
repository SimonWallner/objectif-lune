#ifndef SERVER_HANDLER_HPP_
#define SERVER_HANDLER_HPP_

#include <iostream>
#include <string>
#include <set>

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
#pragma GCC diagnostic ignored "-Wsign-compare"
#include <websocketpp.hpp>
#pragma GCC diagnostic pop

namespace objectifLune
{
	class ServerHandler : public websocketpp::server::handler
	{
	public:
		
		class MessageCallback
		{
		public:
			virtual void onMessage(std::string message) = 0;
		};

	

		ServerHandler(MessageCallback* callback);
		
		void on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg);
		
		void on_open(websocketpp::server::connection_ptr con);
		
		void on_close(websocketpp::server::connection_ptr con);
		
		void broadcast(const std::string& msg) const;
		
		// return true if there is at least one client connected.
		bool hasConnections() const;
		
	private:
		typedef std::set<connection_ptr> connection_set;
		
		connection_set connections;
		mutable boost::mutex mutex;    // guards m_connections
		
		MessageCallback* messageCallback;
	};
}

#endif
