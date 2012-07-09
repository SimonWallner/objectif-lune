#include <objectifLune.hpp>

using namespace objectifLune;

void Server::on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg)
{
	con->send(msg->get_payload(), msg->get_opcode());
 }
