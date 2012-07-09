#include <objectifLune.hpp>

using namespace objectifLune;

void Server::hello()
{
	std::cout << "bonjour, lune!" << std::endl;
}

Server::Server(int _portNumber)
	: portNumber(_portNumber)
{}

//void Server::on_message(websocketpp::server::connection_ptr con,
//						websocketpp::message::data_ptr msg) {
//	con->send(msg->get_payload(), msg->get_opcode());
//
// }
