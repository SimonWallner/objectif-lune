#include <objectifLune.hpp>

#include <iostream>

using namespace objectifLune;

void Server::on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg)
{
	con->send(msg->get_payload(), msg->get_opcode());
 }


void Server::on_open(websocketpp::server::connection_ptr con)
{
	std::cout << "connection opened" << std::endl;
}
