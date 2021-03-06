#include "serverHandler.hpp"

#include <iostream>

using namespace objectifLune;

ServerHandler::ServerHandler(MessageCallback* callback)
	: messageCallback(callback)
{}

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-parameter"
void ServerHandler::on_message(websocketpp::server::connection_ptr con,
							   websocketpp::message::data_ptr msg)
{
	if (msg->get_opcode() != websocketpp::frame::opcode::TEXT)
	{
        return;
    }
	
	messageCallback->onMessage(msg->get_payload());
}
#pragma GCC diagnostic pop

void ServerHandler::on_close(websocketpp::server::connection_ptr con)
{
	std::cout << "-- connection closed" << std::endl;
	boost::lock_guard<boost::mutex> guard(mutex);
	connections.erase(con);
}


void ServerHandler::on_open(websocketpp::server::connection_ptr con)
{
	std::cout << "++ connection opened" << std::endl;
	boost::lock_guard<boost::mutex> guard(mutex);
	connections.insert(con);
}

// broadcast to all clients
void ServerHandler::broadcast(const std::string& msg) const
{
	boost::lock_guard<boost::mutex> guard(mutex);
	for (connection_set::const_iterator ci = connections.begin();
		 ci != connections.end();
		 ci++) {
		(*ci)->send(msg, websocketpp::frame::opcode::TEXT);
	}
}

bool ServerHandler::hasConnections() const
{
	return connections.size() > 0;
}
